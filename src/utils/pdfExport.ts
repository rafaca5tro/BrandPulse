
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditReport, DetailedAnalysis } from '@/types/supabase';

interface ExportOptions {
  includeRecommendations?: boolean;
  fileName?: string;
}

export const exportToPdf = async (
  reportData: AuditReport, 
  options: ExportOptions = {}
): Promise<void> => {
  const {
    includeRecommendations = true,
    fileName = `Brand_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`
  } = options;

  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Define text styles
  const titleFontSize = 20;
  const subtitleFontSize = 16;
  const sectionTitleFontSize = 14; 
  const normalFontSize = 10;
  const smallFontSize = 8;
  
  // Define colors as tuples with explicit type annotation
  const primaryColor: [number, number, number] = [139, 254, 62]; // #8BFE3E - brand green
  const secondaryColor: [number, number, number] = [52, 58, 64]; // #343A40 - brand gray
  const accentColor: [number, number, number] = [0, 0, 0]; // #000000 - brand blue (black)
  const textColor: [number, number, number] = [51, 51, 51];
  const lightGrayColor: [number, number, number] = [248, 249, 250];
  
  // Get page width for positioning
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - 20; // 10mm margins on each side
  const leftMargin = 10;
  const rightMargin = pageWidth - 10;

  // Detect URL type to determine display style
  const getUrlType = (url: string): { type: string, username?: string } => {
    if (!url) return { type: 'website' };
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      if (hostname.includes('instagram.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'instagram', username: pathParts[0] || '' };
      }
      
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'twitter', username: pathParts[0] || '' };
      }
      
      if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'facebook', username: pathParts[0] || '' };
      }
      
      if (hostname.includes('linkedin.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'linkedin', username: pathParts[1] || '' };
      }
      
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'youtube', username: pathParts[0] || '' };
      }
      
      if (hostname.includes('tiktok.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        return { type: 'tiktok', username: pathParts[1] || '' };
      }
      
      return { type: 'website' };
    } catch (e) {
      return { type: 'website' };
    }
  };

  // Get domain from URL
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  const urlType = getUrlType(reportData.url);
  const domain = getDomain(reportData.url);
  
  // Add elegant header with gradient background
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Add green accent line
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 35, pageWidth, 2, 'F');
  
  // Add PlaymakerAI title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(titleFontSize);
  doc.setFont('helvetica', 'bold');
  doc.text('PlaymakerAI', leftMargin, 15);
  
  doc.setFontSize(subtitleFontSize);
  doc.setFont('helvetica', 'normal');
  doc.text('Brand Audit Report', leftMargin, 25);
  
  // Add date on right side
  doc.setFontSize(normalFontSize);
  doc.setTextColor(200, 200, 200);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, rightMargin - 40, 15, { align: 'right' });
  
  // Detect if it's a social media profile or website
  const isSocialMedia = urlType.type !== 'website';
  
  // Add account information
  if (isSocialMedia && urlType.username) {
    // Social media profile
    doc.setTextColor(200, 200, 200);
    doc.text(`@${urlType.username}`, rightMargin - 40, 25, { align: 'right' });
    
    // Add platform icon
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${urlType.type.toUpperCase()}`, rightMargin - 10, 25, { align: 'right' });
  } else {
    // Website
    doc.setTextColor(200, 200, 200);
    doc.text(`${domain}`, rightMargin - 10, 25, { align: 'right' });
  }
  
  // Add circular avatar/logo placeholder
  const avatarX = rightMargin - 25;
  const avatarY = 17;
  const avatarRadius = 8;
  
  // Green circle background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.circle(avatarX, avatarY, avatarRadius, 'F');
  
  // Draw placeholder text inside circle
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(
    isSocialMedia ? urlType.username?.substring(0, 2).toUpperCase() || 'SM' : domain.substring(0, 2).toUpperCase(), 
    avatarX, 
    avatarY + 4, 
    { align: 'center' }
  );
  
  // Reset color for body content
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(normalFontSize);
  doc.setFont('helvetica', 'normal');
  
  // Add URL being analyzed
  let yPos = 45;
  doc.text(`Analysis for: ${reportData.url}`, leftMargin, yPos);
  yPos += 10;

  // Add overall score in an elegant box
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
  doc.roundedRect(leftMargin, yPos, contentWidth, 24, 2, 2, 'F');
  
  doc.setFontSize(sectionTitleFontSize);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Brand Performance', leftMargin + 5, yPos + 8);
  
  // Add score circle
  const scoreCircleX = pageWidth - 30;
  const scoreCircleY = yPos + 12;
  const scoreRadius = 10;
  
  const scoreColor = getScoreColor(reportData.score);
  
  // Draw score circle
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.2);
  doc.circle(scoreCircleX, scoreCircleY, scoreRadius, 'F');
  
  // Draw score outline
  doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setLineWidth(0.5);
  doc.circle(scoreCircleX, scoreCircleY, scoreRadius, 'S');
  
  // Draw score text
  doc.setFontSize(titleFontSize - 6);
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`${reportData.score}`, scoreCircleX, scoreCircleY + 4, { align: 'center' });
  
  // Draw label
  doc.setFontSize(normalFontSize);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(getScoreLabel(reportData.score), pageWidth - 50, scoreCircleY + 4);
  
  yPos += 30;
  
  // Add executive summary section with elegant design
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.05);
  doc.roundedRect(leftMargin, yPos, contentWidth, 8, 2, 2, 'F');
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.3);
  doc.setLineWidth(0.3);
  doc.roundedRect(leftMargin, yPos, contentWidth, 8, 2, 2, 'S');
  
  doc.setFontSize(sectionTitleFontSize);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Executive Summary', leftMargin + 5, yPos + 6);
  
  yPos += 12;
  
  // Word wrap the summary text
  doc.setFontSize(normalFontSize);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const splitSummary = doc.splitTextToSize(reportData.summary, contentWidth);
  doc.text(splitSummary, leftMargin, yPos);
  
  yPos += splitSummary.length * 6 + 5;
  
  // Add score breakdown section
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.05);
  doc.roundedRect(leftMargin, yPos, contentWidth, 8, 2, 2, 'F');
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.3);
  doc.setLineWidth(0.3);
  doc.roundedRect(leftMargin, yPos, contentWidth, 8, 2, 2, 'S');
  
  doc.setFontSize(sectionTitleFontSize);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Score Breakdown', leftMargin + 5, yPos + 6);
  
  yPos += 12;
  
  if (reportData.score_breakdown) {
    // Create a table for score breakdown with improved design
    const scoreData = Object.entries(reportData.score_breakdown).map(([key, value]) => [
      key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value.toFixed(1)
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Category', 'Score (0-100)']],
      body: scoreData,
      margin: { left: leftMargin },
      headStyles: { 
        fillColor: secondaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 40, halign: 'center' },
      },
      styles: {
        fontSize: normalFontSize,
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      }
    });
    
    // Update yPos to the final position after the table
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Check if we need to add a new page
  if (yPos > 260) {
    doc.addPage();
    yPos = 20;
  }
  
  // Add detailed analysis sections with a more professional layout
  if (reportData.detailed_analysis) {
    const sections = [
      { key: 'visual_analysis', title: 'Visual Identity Analysis' },
      { key: 'messaging_analysis', title: 'Messaging Analysis' },
      { key: 'positioning_analysis', title: 'Positioning Analysis' },
      { key: 'social_media_analysis', title: 'Social Media Analysis' }
    ];
    
    for (const section of sections) {
      const analysisData = reportData.detailed_analysis[section.key as keyof typeof reportData.detailed_analysis];
      
      if (analysisData) {
        // Check if we need to add a new page
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }
        
        // Add section header with gradient background
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 0.8);
        doc.roundedRect(leftMargin, yPos, contentWidth, 8, 2, 2, 'F');
        
        doc.setFontSize(sectionTitleFontSize);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(section.title, leftMargin + 5, yPos + 6);
        
        yPos += 12;
        
        // Add summary if available with a subtle background
        if (analysisData.summary) {
          doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
          doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'F');
          
          doc.setFontSize(normalFontSize);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text('Summary:', leftMargin + 2, yPos + 4);
          
          yPos += 8;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          const summaryText = doc.splitTextToSize(analysisData.summary, contentWidth - 5);
          doc.text(summaryText, leftMargin + 5, yPos);
          yPos += summaryText.length * 6 + 4;
        }
        
        // Add content details specific to each section with improved formatting
        if (section.key === 'visual_analysis') {
          // Add specific details about color palette
          if (analysisData.color_palette) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Color Palette:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const colorPaletteText = doc.splitTextToSize(analysisData.color_palette, contentWidth - 5);
            doc.text(colorPaletteText, leftMargin + 5, yPos);
            yPos += colorPaletteText.length * 6 + 4;
          }
          
          // Add typography details
          if (analysisData.typography) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Typography:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const typographyText = doc.splitTextToSize(analysisData.typography, contentWidth - 5);
            doc.text(typographyText, leftMargin + 5, yPos);
            yPos += typographyText.length * 6 + 4;
          }

          // Add logo usage details
          if (analysisData.logo_usage) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Logo Usage:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const logoUsageText = doc.splitTextToSize(analysisData.logo_usage, contentWidth - 5);
            doc.text(logoUsageText, leftMargin + 5, yPos);
            yPos += logoUsageText.length * 6 + 4;
          }

          // Add design language details
          if (analysisData.design_language) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Design Language:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const designText = doc.splitTextToSize(analysisData.design_language, contentWidth - 5);
            doc.text(designText, leftMargin + 5, yPos);
            yPos += designText.length * 6 + 4;
          }
        }
        else if (section.key === 'messaging_analysis') {
          // Add tone of voice details
          if (analysisData.tone_of_voice) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Tone of Voice:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const toneText = doc.splitTextToSize(analysisData.tone_of_voice, contentWidth - 5);
            doc.text(toneText, leftMargin + 5, yPos);
            yPos += toneText.length * 6 + 4;
          }
          
          // Add key messages
          if (analysisData.key_messages) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Key Messages:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const messagesText = doc.splitTextToSize(analysisData.key_messages, contentWidth - 5);
            doc.text(messagesText, leftMargin + 5, yPos);
            yPos += messagesText.length * 6 + 4;
          }

          // Add communication strategy
          if (analysisData.communication_strategy) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Communication Strategy:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const strategyText = doc.splitTextToSize(analysisData.communication_strategy, contentWidth - 5);
            doc.text(strategyText, leftMargin + 5, yPos);
            yPos += strategyText.length * 6 + 4;
          }

          // Add engagement metrics if available with an improved table style
          if (analysisData.engagement_metrics) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Engagement Metrics:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            const metrics = analysisData.engagement_metrics;
            const metricsData = Object.entries(metrics).map(([key, value]) => [
              key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
              typeof value === 'number' ? value.toFixed(1) : value.toString()
            ]);
            
            autoTable(doc, {
              startY: yPos,
              body: metricsData,
              margin: { left: leftMargin + 5 },
              theme: 'striped',
              styles: { fontSize: 9 },
              headStyles: { fillColor: [245, 245, 245], textColor: [50, 50, 50] },
              columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 40, halign: 'right' },
              }
            });
            
            yPos = (doc as any).lastAutoTable.finalY + 4;
          }
        }
        else if (section.key === 'social_media_analysis') {
          // Add content strategy
          if ('content_strategy' in analysisData) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Content Strategy:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const strategyText = doc.splitTextToSize((analysisData as any).content_strategy, contentWidth - 5);
            doc.text(strategyText, leftMargin + 5, yPos);
            yPos += strategyText.length * 6 + 4;
          }
          
          // Add engagement info
          if ('engagement' in analysisData) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Engagement:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const engagementText = doc.splitTextToSize((analysisData as any).engagement, contentWidth - 5);
            doc.text(engagementText, leftMargin + 5, yPos);
            yPos += engagementText.length * 6 + 4;
          }
          
          // Add growth opportunities
          if ('growth_opportunities' in analysisData) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Growth Opportunities:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const growthText = doc.splitTextToSize((analysisData as any).growth_opportunities, contentWidth - 5);
            doc.text(growthText, leftMargin + 5, yPos);
            yPos += growthText.length * 6 + 4;
          }

          // Add engagement metrics with improved visualization
          if (('engagement_metrics' in analysisData && (analysisData as any).engagement_metrics) || 
              ('metrics' in analysisData && (analysisData as any).metrics)) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Social Media Metrics:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            const metrics = (analysisData as any).engagement_metrics || (analysisData as any).metrics;
            const metricsData = Object.entries(metrics).map(([key, value]) => [
              key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
              value.toString()
            ]);
            
            autoTable(doc, {
              startY: yPos,
              head: [['Metric', 'Value']],
              body: metricsData,
              margin: { left: leftMargin + 5 },
              theme: 'striped',
              styles: { fontSize: 9 },
              headStyles: { fillColor: secondaryColor, textColor: [255, 255, 255] },
              columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 60, halign: 'right' },
              }
            });
            
            yPos = (doc as any).lastAutoTable.finalY + 4;
          }
        }
        else if (section.key === 'positioning_analysis') {
          // Add market position
          if ('market_position' in analysisData) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Market Position:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const positionText = doc.splitTextToSize((analysisData as any).market_position, contentWidth - 5);
            doc.text(positionText, leftMargin + 5, yPos);
            yPos += positionText.length * 6 + 4;
          }
          
          // Add competitor comparison
          if ('competitor_comparison' in analysisData) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Competitor Comparison:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const comparisonText = doc.splitTextToSize((analysisData as any).competitor_comparison, contentWidth - 5);
            doc.text(comparisonText, leftMargin + 5, yPos);
            yPos += comparisonText.length * 6 + 4;
          }
          
          // Add unique selling points
          if ('unique_selling_points' in analysisData) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Unique Selling Points:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const uspText = doc.splitTextToSize((analysisData as any).unique_selling_points, contentWidth - 5);
            doc.text(uspText, leftMargin + 5, yPos);
            yPos += uspText.length * 6 + 4;
          }

          // Add differentiation score with a visual element
          if ('differentiation_score' in analysisData) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.roundedRect(leftMargin, yPos, contentWidth, 6, 1, 1, 'FD');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text('Differentiation Score:', leftMargin + 2, yPos + 4);
            
            yPos += 8;
            
            const score = (analysisData as any).differentiation_score;
            const scoreNum = typeof score === 'number' ? score : parseInt(score);
            
            // Draw score bar
            doc.setFillColor(230, 230, 230);
            doc.rect(leftMargin + 5, yPos, 100, 5, 'F');
            
            if (!isNaN(scoreNum)) {
              const barColor = scoreNum >= 80 ? [39, 174, 96] : scoreNum >= 60 ? [230, 126, 34] : [231, 76, 60];
              doc.setFillColor(barColor[0], barColor[1], barColor[2]);
              doc.rect(leftMargin + 5, yPos, Math.min(scoreNum, 100), 5, 'F');
            }
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(`${typeof score === 'number' ? score.toFixed(1) : score}/100`, leftMargin + 110, yPos + 4);
            
            yPos += 10;
          }
        }
        
        // Add strengths and weaknesses with improved visual distinction
        if (analysisData.strengths || analysisData.weaknesses) {
          // Check if we need to add a new page
          if (yPos > 240) {
            doc.addPage();
            yPos = 20;
          }
          
          // Two-column layout for strengths and weaknesses
          const colWidth = contentWidth / 2 - 4;
          let leftColY = yPos;
          let rightColY = yPos;
          
          // Strengths column (left)
          if (analysisData.strengths && analysisData.strengths.length > 0) {
            doc.setFillColor(39, 174, 96, 0.1);
            doc.roundedRect(leftMargin, leftColY, colWidth, 6, 1, 1, 'F');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(39, 174, 96);
            doc.text('Strengths', leftMargin + 5, leftColY + 4);
            
            leftColY += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            
            for (const strength of analysisData.strengths) {
              const bulletText = `• ${strength}`;
              const splitText = doc.splitTextToSize(bulletText, colWidth - 5);
              doc.text(splitText, leftMargin + 5, leftColY);
              leftColY += splitText.length * 6;
            }
          }
          
          // Weaknesses column (right)
          if (analysisData.weaknesses && analysisData.weaknesses.length > 0) {
            const rightColX = leftMargin + colWidth + 8;
            
            doc.setFillColor(231, 76, 60, 0.1);
            doc.roundedRect(rightColX, rightColY, colWidth, 6, 1, 1, 'F');
            
            doc.setFontSize(normalFontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(231, 76, 60);
            doc.text('Weaknesses', rightColX + 5, rightColY + 4);
            
            rightColY += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            
            for (const weakness of analysisData.weaknesses) {
              const bulletText = `• ${weakness}`;
              const splitText = doc.splitTextToSize(bulletText, colWidth - 5);
              doc.text(splitText, rightColX + 5, rightColY);
              rightColY += splitText.length * 6;
            }
          }
          
          // Set yPos to the greater of the two columns
          yPos = Math.max(leftColY, rightColY) + 4;
        }
        
        // Add recommendations with an elegant design
        if (includeRecommendations && analysisData.recommendations && analysisData.recommendations.length > 0) {
          // Check if we need to add a new page
          if (yPos > 220) {
            doc.addPage();
            yPos = 20;
          }
          
          yPos += 8;
          
          // Add recommendations header
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1);
          doc.roundedRect(leftMargin, yPos, contentWidth, 8, 2, 2, 'F');
          
          doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.3);
          doc.roundedRect(leftMargin, yPos, contentWidth, 8, 2, 2, 'S');
          
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text('Strategic Recommendations', leftMargin + 5, yPos + 6);
          
          yPos += 12;
          
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.setFont('helvetica', 'normal');
          
          for (let i = 0; i < analysisData.recommendations.length; i++) {
            const recommendation = analysisData.recommendations[i];
            const bulletText = `${i + 1}. ${recommendation}`;
            const splitText = doc.splitTextToSize(bulletText, contentWidth - 5);
            
            // Draw a box for each recommendation
            const recHeight = splitText.length * 6 + 6;
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.05);
            doc.roundedRect(leftMargin, yPos - 2, contentWidth, recHeight, 1, 1, 'F');
            
            doc.text(splitText, leftMargin + 5, yPos);
            yPos += splitText.length * 6 + 4;
            
            // Check if we need to add a new page
            if (yPos > 270 && i < analysisData.recommendations.length - 1) {
              doc.addPage();
              yPos = 20;
            }
          }
        }
        
        yPos += 10;
      }
    }
  }
  
  // Add footer to each page with a professional design
  const totalPages = (doc as any).getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Add footer line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, 285, pageWidth - leftMargin, 285);
    
    // Add footer text
    doc.setFontSize(smallFontSize);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    
    // Add company name on left
    doc.text('PlaymakerAI Brand Audit', leftMargin, 290);
    
    // Add page numbers in center
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
    
    // Add generated date on right
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - leftMargin, 290, { align: 'right' });
  }
  
  // Save the PDF
  doc.save(fileName);
};

// Helper function to determine score color with explicit return type
function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return [139, 254, 62]; // Green/Primary
  if (score >= 70) return [230, 126, 34]; // Orange
  return [231, 76, 60]; // Red
}

// Helper function to get score label
function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  return 'Needs Improvement';
}
