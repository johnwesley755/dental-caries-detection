from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
from datetime import datetime
import requests
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
from typing import Optional
from ..models.detection import Detection
from ..models.patient import Patient
from ..core.config import settings

class ReportService:
    """Service for generating PDF reports of detection results"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            spaceBefore=12
        ))
    
    def generate_detection_report(
        self,
        detection: Detection,
        patient: Patient,
        include_images: bool = True
    ) -> bytes:
        """
        Generate a comprehensive PDF report for a detection
        
        Args:
            detection: Detection object with findings
            patient: Patient object
            include_images: Whether to include images in the report
            
        Returns:
            PDF file as bytes
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        # Build the story (content)
        story = []
        
        # Header
        story.extend(self._build_header(detection, patient))
        story.append(Spacer(1, 0.3*inch))
        
        # Summary Section
        story.extend(self._build_summary(detection))
        story.append(Spacer(1, 0.3*inch))
        
        # Images Section
        print(f"Include images: {include_images}")
        print(f"Original image URL: {detection.original_image_url}")
        print(f"Annotated image URL: {detection.annotated_image_url}")
        
        if include_images and (detection.original_image_url or detection.annotated_image_url):
            print("Building images section...")
            story.extend(self._build_images_section(detection))
            story.append(PageBreak())
        else:
            print("Skipping images section - no URLs available or include_images=False")
        
        # Chart Analysis Section
        if detection.caries_findings and len(detection.caries_findings) > 0:
            story.extend(self._build_chart_section(detection))
            story.append(Spacer(1, 0.3*inch))
        
        # Detailed Findings
        if detection.caries_findings:
            story.extend(self._build_findings_section(detection))
            story.append(Spacer(1, 0.3*inch))
        
        # Notes Section
        if detection.notes:
            story.extend(self._build_notes_section(detection))
            story.append(Spacer(1, 0.3*inch))
        
        # Footer
        story.extend(self._build_footer())
        
        # Build PDF
        doc.build(story)
        
        # Get the PDF bytes
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes
    
    def _build_header(self, detection: Detection, patient: Patient) -> list:
        """Build report header"""
        elements = []
        
        # Title
        title = Paragraph("DENTAL DETECTION REPORT", self.styles['CustomTitle'])
        elements.append(title)
        elements.append(Spacer(1, 0.2*inch))
        
        # Patient and Detection Info
        info_data = [
            ['Detection ID:', detection.detection_id, 'Patient:', patient.full_name],
            ['Date:', datetime.fromisoformat(str(detection.detection_date)).strftime('%B %d, %Y'), 
             'Status:', detection.status.value.upper()],
        ]
        
        info_table = Table(info_data, colWidths=[1.5*inch, 2*inch, 1*inch, 2*inch])
        info_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#374151')),
            ('TEXTCOLOR', (2, 0), (2, -1), colors.HexColor('#374151')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        elements.append(info_table)
        
        return elements
    
    def _build_summary(self, detection: Detection) -> list:
        """Build summary statistics section"""
        elements = []
        
        # Section Header
        header = Paragraph("SUMMARY", self.styles['SectionHeader'])
        elements.append(header)
        
        # Summary Table
        summary_data = [
            ['Teeth Detected', 'Caries Found', 'Total Findings', 'Processing Time'],
            [
                str(detection.total_teeth_detected),
                str(detection.total_caries_detected),
                str(len(detection.caries_findings)),
                f"{(detection.processing_time_ms / 1000):.2f}s" if detection.processing_time_ms else "N/A"
            ]
        ]
        
        summary_table = Table(summary_data, colWidths=[1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('FONTSIZE', (0, 1), (-1, -1), 14),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 1), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
        ]))
        
        elements.append(summary_table)
        
        return elements
    
    def _build_images_section(self, detection: Detection) -> list:
        """Build images comparison section"""
        elements = []
        
        # Section Header
        header = Paragraph("IMAGE COMPARISON", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 0.1*inch))
        
        # Download images and create table
        images_data = []
        labels = []
        
        if detection.original_image_url:
            labels.append('Original Image')
        if detection.annotated_image_url:
            labels.append('AI Detection')
        
        if labels:
            images_data.append(labels)
            
            image_row = []
            img_width = 2.5*inch
            img_height = 2*inch
            
            if detection.original_image_url:
                try:
                    print(f"Downloading original image from: {detection.original_image_url}")
                    orig_img = self._download_image(detection.original_image_url, img_width, img_height)
                    image_row.append(orig_img)
                    print("Original image downloaded successfully")
                except Exception as e:
                    print(f"Failed to download original image: {str(e)}")
                    image_row.append(Paragraph("Original image not available", self.styles['Normal']))
            
            if detection.annotated_image_url:
                try:
                    print(f"Downloading annotated image from: {detection.annotated_image_url}")
                    annot_img = self._download_image(detection.annotated_image_url, img_width, img_height)
                    image_row.append(annot_img)
                    print("Annotated image downloaded successfully")
                except Exception as e:
                    print(f"Failed to download annotated image: {str(e)}")
                    image_row.append(Paragraph("AI detection image not available", self.styles['Normal']))
            
            images_data.append(image_row)
            
            images_table = Table(images_data, colWidths=[3*inch, 3*inch])
            images_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
                ('TOPPADDING', (0, 1), (-1, -1), 10),
            ]))
            
            elements.append(images_table)
        
        return elements
    
    def _download_image(self, url: str, width: float, height: float) -> Image:
        """Download image from URL and return ReportLab Image object"""
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        img_buffer = BytesIO(response.content)
        img = Image(img_buffer, width=width, height=height)
        
        return img
    
    def _build_findings_section(self, detection: Detection) -> list:
        """Build detailed findings section"""
        elements = []
        
        # Section Header
        header = Paragraph("DETAILED FINDINGS", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 0.1*inch))
        
        # Findings Table
        findings_data = [['#', 'Tooth', 'Severity', 'Location', 'Confidence', 'Recommendation']]
        
        for idx, finding in enumerate(detection.caries_findings, 1):
            findings_data.append([
                str(idx),
                f"#{finding.tooth_number}" if finding.tooth_number else "N/A",
                finding.severity.value.capitalize() if finding.severity else "N/A",
                finding.location or "N/A",
                f"{(finding.confidence_score * 100):.1f}%",
                finding.treatment_recommendation or "N/A"
            ])
        
        findings_table = Table(findings_data, colWidths=[0.4*inch, 0.7*inch, 1*inch, 1.2*inch, 1*inch, 2.2*inch])
        findings_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
        ]))
        
        elements.append(findings_table)
        
        return elements
    
    def _build_notes_section(self, detection: Detection) -> list:
        """Build dentist notes section"""
        elements = []
        
        # Section Header
        header = Paragraph("DENTIST NOTES", self.styles['SectionHeader'])
        elements.append(header)
        
        # Notes content
        notes = Paragraph(detection.notes, self.styles['Normal'])
        elements.append(notes)
        
        return elements
    
    def _build_chart_section(self, detection: Detection) -> list:
        """Build severity distribution chart section"""
        elements = []
        
        # Section Header
        header = Paragraph("SEVERITY ANALYSIS", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 0.1*inch))
        
        # Count severity levels
        severity_counts = {'mild': 0, 'moderate': 0, 'severe': 0}
        for finding in detection.caries_findings:
            if finding.severity:
                severity_level = finding.severity.value.lower()
                if severity_level in severity_counts:
                    severity_counts[severity_level] += 1
        
        # Only create chart if there are findings
        if sum(severity_counts.values()) > 0:
            try:
                # Create chart
                chart_buffer = self._create_severity_chart(severity_counts)
                
                # Add chart to PDF
                chart_img = Image(chart_buffer, width=5*inch, height=3*inch)
                elements.append(chart_img)
                
                # Add interpretation
                elements.append(Spacer(1, 0.2*inch))
                interpretation = self._get_severity_interpretation(severity_counts)
                interp_para = Paragraph(interpretation, self.styles['Normal'])
                elements.append(interp_para)
                
            except Exception as e:
                print(f"Failed to create chart: {str(e)}")
                elements.append(Paragraph("Chart generation unavailable", self.styles['Normal']))
        
        return elements
    
    def _create_severity_chart(self, severity_counts: dict) -> BytesIO:
        """Create a severity distribution pie chart"""
        # Filter out zero counts
        labels = []
        sizes = []
        colors_list = []
        
        color_map = {
            'mild': '#fbbf24',      # Yellow
            'moderate': '#f97316',  # Orange
            'severe': '#dc2626'     # Red
        }
        
        for severity, count in severity_counts.items():
            if count > 0:
                labels.append(f"{severity.capitalize()}\n({count})")
                sizes.append(count)
                colors_list.append(color_map[severity])
        
        # Create figure
        fig, ax = plt.subplots(figsize=(6, 4), facecolor='white')
        
        # Create pie chart
        wedges, texts, autotexts = ax.pie(
            sizes,
            labels=labels,
            colors=colors_list,
            autopct='%1.1f%%',
            startangle=90,
            textprops={'fontsize': 11, 'weight': 'bold'}
        )
        
        # Make percentage text white
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontsize(12)
            autotext.set_weight('bold')
        
        ax.set_title('Severity Distribution', fontsize=14, weight='bold', pad=20)
        
        # Save to buffer
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight', facecolor='white')
        plt.close(fig)
        buffer.seek(0)
        
        return buffer
    
    def _get_severity_interpretation(self, severity_counts: dict) -> str:
        """Generate interpretation text based on severity distribution"""
        total = sum(severity_counts.values())
        
        if total == 0:
            return "No caries detected."
        
        severe_pct = (severity_counts['severe'] / total) * 100
        moderate_pct = (severity_counts['moderate'] / total) * 100
        mild_pct = (severity_counts['mild'] / total) * 100
        
        interpretation = f"<b>Analysis:</b> Out of {total} detected caries, "
        
        parts = []
        if severity_counts['severe'] > 0:
            parts.append(f"{severity_counts['severe']} ({severe_pct:.1f}%) are <b>severe</b> requiring immediate attention")
        if severity_counts['moderate'] > 0:
            parts.append(f"{severity_counts['moderate']} ({moderate_pct:.1f}%) are <b>moderate</b>")
        if severity_counts['mild'] > 0:
            parts.append(f"{severity_counts['mild']} ({mild_pct:.1f}%) are <b>mild</b>")
        
        if len(parts) > 1:
            interpretation += ", ".join(parts[:-1]) + ", and " + parts[-1] + "."
        else:
            interpretation += parts[0] + "."
        
        # Add recommendation
        if severity_counts['severe'] > 0:
            interpretation += " <b>Immediate dental consultation is strongly recommended.</b>"
        elif severity_counts['moderate'] > 0:
            interpretation += " <b>Schedule a dental appointment soon.</b>"
        else:
            interpretation += " <b>Regular monitoring and preventive care recommended.</b>"
        
        return interpretation
    
    def _build_footer(self) -> list:
        """Build report footer with clinic information"""
        elements = []
        
        elements.append(Spacer(1, 0.5*inch))
        
        # Hospital Information
        clinic_info = f"""
        <para alignment="center">
        <b>{settings.HOSPITAL_NAME}</b><br/>
        {settings.HOSPITAL_ADDRESS if settings.HOSPITAL_ADDRESS else ''}<br/>
        {f'Phone: {settings.HOSPITAL_PHONE}' if settings.HOSPITAL_PHONE else ''}<br/>
        {f'Email: {settings.HOSPITAL_EMAIL}' if settings.HOSPITAL_EMAIL else ''}
        </para>
        """
        
        footer = Paragraph(clinic_info, self.styles['Normal'])
        elements.append(footer)
        
        # Report generation timestamp
        timestamp = Paragraph(
            f"<para alignment='center'><i>Report generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</i></para>",
            self.styles['Normal']
        )
        elements.append(Spacer(1, 0.1*inch))
        elements.append(timestamp)
        
        return elements
