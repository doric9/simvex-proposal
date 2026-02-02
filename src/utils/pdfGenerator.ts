import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(
  machineryName: string,
  viewerElement: HTMLElement,
  notes: string,
  aiConversation: { role: string; content: string }[]
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // 제목
  pdf.setFontSize(20);
  pdf.text(`SIMVEX - ${machineryName}`, margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, margin, yPosition);
  yPosition += 15;

  // 3D 뷰어 캡처
  try {
    const canvas = await html2canvas(viewerElement, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (yPosition + imgHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
    yPosition += imgHeight + 10;
  } catch (error) {
    console.error('이미지 캡처 실패:', error);
  }

  // 노트
  if (notes) {
    if (yPosition + 20 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(14);
    pdf.text('학습 노트', margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    const noteLines = pdf.splitTextToSize(notes, pageWidth - margin * 2);
    noteLines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 10;
  }

  // AI 대화
  if (aiConversation.length > 0) {
    if (yPosition + 20 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(14);
    pdf.text('AI 어시스턴트 대화', margin, yPosition);
    yPosition += 7;

    aiConversation.forEach((msg) => {
      if (yPosition > pageHeight - margin - 20) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(msg.role === 'user' ? '질문:' : 'AI:', margin, yPosition);
      yPosition += 5;

      pdf.setFont('helvetica', 'normal');
      const msgLines = pdf.splitTextToSize(msg.content, pageWidth - margin * 2);
      msgLines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    });
  }

  // PDF 다운로드
  pdf.save(`SIMVEX_${machineryName}_${Date.now()}.pdf`);
}
