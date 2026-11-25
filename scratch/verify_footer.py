import re

print("--- CSS Verification ---")
with open("H:/web portfolio/styles.css", "r", encoding="utf-8") as f:
    css_content = f.read()

# remove comments and strings
css_clean = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
open_b = css_clean.count('{')
close_b = css_clean.count('}')
print(f"CSS Open braces: {open_b}, Close braces: {close_b}")
assert open_b == close_b, f"Mismatched CSS braces: {open_b} vs {close_b}"

print("\n--- HTML Tag Verification ---")
with open("H:/web portfolio/index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# Check for #contact and key elements
assert 'id="contact"' in html_content
assert 'directMessageForm' in html_content
assert 'whatsappSenderName' in html_content
assert 'whatsappSenderEmail' in html_content
assert 'whatsappService' in html_content
assert 'whatsappProjectDetails' in html_content
assert 'footer-contact-container' in html_content
assert 'footer-3col-grid' in html_content
assert 'footer-copyright-bar' in html_content
print("All key IDs and classes found in index.html!")

print("\n--- Verification Finished Successfully ---")
