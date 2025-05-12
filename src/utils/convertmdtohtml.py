#!/usr/bin/env python3
"""
Convert Markdown files to HTML with section divs and hover effects.

This script takes a markdown file and converts it to HTML, wrapping sections
and subsections in separate divs with hover effects.
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple, Optional
import markdown
from bs4 import BeautifulSoup

class MarkdownConverter:
    """Converts Markdown to HTML with section divs and hover effects."""
    
    def __init__(self):
        """Initialize the converter with default CSS styles."""
        self.css_styles = """
        <style>
            .md-section {
                padding: 20px;
                margin: 10px 0;
                border: 1px solid #e1e4e8;
                border-radius: 6px;
                transition: all 0.3s ease;
                background-color: white;
            }
            
            .md-section:hover {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
                border-color: #0366d6;
                background-color: #f1f8ff;  /* Light blue background on hover */
            }
            
            .md-subsection {
                padding: 15px;
                margin: 8px 0;
                border: 1px solid #e1e4e8;
                border-radius: 4px;
                transition: all 0.3s ease;
                background-color: white;
            }
            
            .md-subsection:hover {
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
                transform: translateX(5px);
                border-color: #28a745;
                background-color: #f1f8ff;  /* Light blue background on hover */
            }
            
            .section-title {
                color: #24292e;
                margin-bottom: 10px;
            }
            
            .subsection-title {
                color: #586069;
                margin-bottom: 8px;
            }
        </style>
        """

    def _extract_sections(self, content: str) -> List[Tuple[int, str, str]]:
        """
        Extract sections and their levels from markdown content.
        
        Args:
            content: The markdown content to process
            
        Returns:
            List of tuples containing (level, title, content)
        """
        # Split content into lines
        lines = content.split('\n')
        sections = []
        current_section = []
        current_level = 0
        current_title = ""
        
        for line in lines:
            # Check for headers (# Header)
            header_match = re.match(r'^(#{1,6})\s+(.+)$', line)
            if header_match:
                # If we have a previous section, save it
                if current_section:
                    sections.append((current_level, current_title, '\n'.join(current_section)))
                    current_section = []
                
                current_level = len(header_match.group(1))
                current_title = header_match.group(2)
            else:
                current_section.append(line)
        
        # Add the last section
        if current_section:
            sections.append((current_level, current_title, '\n'.join(current_section)))
        
        return sections

    def _create_html_structure(self, sections: List[Tuple[int, str, str]]) -> str:
        """
        Create HTML structure with nested divs for sections.
        
        Args:
            sections: List of section tuples (level, title, content)
            
        Returns:
            HTML string with structured content
        """
        md = markdown.Markdown(extensions=['fenced_code', 'tables'])
        html_parts = []
        
        for level, title, content in sections:
            # Convert the section content to HTML
            html_content = md.convert(content)
            
            # Create appropriate div class and title class based on level
            div_class = "md-section" if level == 1 else "md-subsection"
            title_class = "section-title" if level == 1 else "subsection-title"
            
            # Create the section HTML
            section_html = f"""
            <div class="{div_class}">
                <h{level} class="{title_class}">{title}</h{level}>
                {html_content}
            </div>
            """
            html_parts.append(section_html)
        
        return '\n'.join(html_parts)

    def convert_file(self, input_path: str, output_path: Optional[str] = None) -> None:
        """
        Convert a markdown file to HTML with section divs.
        
        Args:
            input_path: Path to the input markdown file
            output_path: Optional path for the output HTML file
        """
        try:
            # Read the markdown file
            with open(input_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract sections
            sections = self._extract_sections(content)
            
            # Create HTML structure
            html_content = self._create_html_structure(sections)
            
            # Create complete HTML document
            html_document = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Markdown Conversion</title>
                {self.css_styles}
            </head>
            <body>
                {html_content}
            </body>
            </html>
            """
            
            # Pretty print the HTML
            soup = BeautifulSoup(html_document, 'html.parser')
            pretty_html = soup.prettify()
            
            # Determine output path
            if output_path is None:
                output_path = str(Path(input_path).with_suffix('.html'))
            
            # Write the HTML file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(pretty_html)
                
            print(f"Successfully converted {input_path} to {output_path}")
            
        except Exception as e:
            print(f"Error converting file: {str(e)}", file=sys.stderr)
            raise

def main():
    """Main function to handle command line usage."""
    if len(sys.argv) < 2:
        print("Usage: python convertmdtohtml.py input.md [output.html]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None
    
    converter = MarkdownConverter()
    converter.convert_file(input_path, output_path)

if __name__ == "__main__":
    main() 