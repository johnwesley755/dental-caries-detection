
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
