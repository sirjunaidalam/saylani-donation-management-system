import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Import it as a function

export const printReceipt = (donation) => {
  const doc = new jsPDF();

  // Inside your generate-receipt logic
  doc.text(`Status: ${donation.status}`, 20, 100);

  if (donation.status !== "Verified") {
    doc.setTextColor(200, 0, 0); // Red text
    doc.text("NOTE: THIS PAYMENT IS SUBJECT TO VERIFICATION", 20, 110);
  }

  // Header Section
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text("SAYLANI DONATION SYSTEM", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Official Donation Receipt", 105, 30, { align: "center" });

  // Use the autoTable function directly instead of doc.autoTable
  autoTable(doc, {
    startY: 45,
    head: [["Description", "Details"]],
    body: [
      ["Donor Name", donation.donorName || "Valued Donor"],
      ["Campaign", donation.campaign || "General"],
      ["Fund Type", donation.type || "N/A"],
      ["Category", donation.category || "N/A"],
      ["Payment Method", donation.payment || "N/A"],
      ["Amount", `Rs. ${donation.amount}`],
      [
        "Date",
        donation.createdAt?.seconds
          ? new Date(donation.createdAt.seconds * 1000).toLocaleDateString()
          : new Date().toLocaleDateString(),
      ],
      ["Status", donation.status],
      ["Transaction ID", donation.id],
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] }, // Saylani Blue
    styles: { fontSize: 10 },
  });

  // Footer
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(
    "This is a computer-generated receipt and does not require a signature.",
    105,
    finalY + 20,
    { align: "center" }
  );
  doc.text(
    "Thank you for your generous contribution to Saylani Welfare.",
    105,
    finalY + 25,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`Saylani-Receipt-${donation.id.substring(0, 6)}.pdf`);
};
