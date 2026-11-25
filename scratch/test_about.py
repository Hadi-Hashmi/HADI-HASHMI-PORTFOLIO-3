with open("H:/web portfolio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

checks = [
    'about-3col-grid',
    'about-watermark-bg',
    'ABOUT ME',
    'title-line-about',
    'title-line-me',
    'about-lead-headline',
    'Fast, Functional &amp; Visually Engaging.',
    'Frontend and WordPress Developer',
    'The Hunar Foundation (ARWE Trust)',
    'Sir Talha',
    'Hadi Hashmi',
    'Agentic AI',
    'GIAC (Governor House Karachi)',
    'ACTIVE FOCUS',
    'SPECIALIZATION',
    'PHILOSOPHY',
    'METHODOLOGY',
    'PERFORMANCE',
    'Freelance Web Developer',
    'Accounts Assistant',
    'Design &amp; Integration',
    'PRESENT',
    'PRACTICAL',
    'CREATIVE'
]

for c in checks:
    assert c in html, f"Missing: {c}"

assert 'MY MISSION' not in html, "MY MISSION should not be in html"

print("All about section checks passed!")
