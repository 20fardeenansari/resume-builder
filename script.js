document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const formFields = document.querySelectorAll('input[data-field], textarea[data-field]');
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const addEducationBtn = document.getElementById('addEducationBtn');
    const experienceList = document.getElementById('experienceList');
    const educationList = document.getElementById('educationList');
    const skillInput = document.getElementById('skillInput');
    const skillsContainer = document.getElementById('skillsContainer');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');

    // Preview Elements
    const emptyPreviewState = document.getElementById('emptyPreviewState');
    const activePreviewContent = document.getElementById('activePreviewContent');
    const previewName = document.getElementById('previewName');
    const previewJobTitle = document.getElementById('previewJobTitle');
    const previewEmail = document.getElementById('previewEmail');
    const previewPhone = document.getElementById('previewPhone');
    const previewLocation = document.getElementById('previewLocation');
    const previewPortfolio = document.getElementById('previewPortfolio');
    const previewSummary = document.getElementById('previewSummary');

    // Preview Containers
    const previewEmailContainer = document.getElementById('previewEmailContainer');
    const previewPhoneContainer = document.getElementById('previewPhoneContainer');
    const previewLocationContainer = document.getElementById('previewLocationContainer');
    const previewPortfolioContainer = document.getElementById('previewPortfolioContainer');
    const previewSummaryContainer = document.getElementById('previewSummaryContainer');
    const previewExperienceContainer = document.getElementById('previewExperienceContainer');
    const previewEducationContainer = document.getElementById('previewEducationContainer');
    const previewSkillsContainer = document.getElementById('previewSkillsContainer');

    // Dynamic Preview Lists
    const previewExperienceList = document.getElementById('previewExperienceList');
    const previewEducationList = document.getElementById('previewEducationList');
    const previewSkillsList = document.getElementById('previewSkillsList');

    let skills = [];
    let hasInteracted = false;

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function toggleVisibility(container, val) {
        container.style.display = val && val.trim() !== '' ? '' : 'none';
    }

    function updateProgress() {
        const totalBasicFields = formFields.length;
        let filledBasic = 0;

        formFields.forEach(field => {
            if (field.value.trim() !== '') filledBasic++;
        });

        const extraWeight = 3; // experience + education + skills
        let extraFilled = 0;

        const expCards = Array.from(experienceList.querySelectorAll('.entry-card'));
        const hasExpData = expCards.some(card =>
            Array.from(card.querySelectorAll('input, textarea')).some(input => input.value.trim() !== '')
        );
        if (hasExpData) extraFilled++;

        const eduCards = Array.from(educationList.querySelectorAll('.entry-card'));
        const hasEduData = eduCards.some(card =>
            Array.from(card.querySelectorAll('input, textarea')).some(input => input.value.trim() !== '')
        );
        if (hasEduData) extraFilled++;

        if (skills.length > 0) extraFilled++;

        const total = totalBasicFields + extraWeight;
        const filled = filledBasic + extraFilled;
        const percentage = Math.round((filled / total) * 100);

        progressBar.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;

        if (filled > 0 || hasInteracted) {
            hasInteracted = true;
            emptyPreviewState.style.display = 'none';
            activePreviewContent.style.display = 'block';
        } else {
            emptyPreviewState.style.display = 'flex';
            activePreviewContent.style.display = 'none';
        }
    }

    function updateBasicPreview() {
        const fName = document.getElementById('fullName').value.trim();
        const jTitle = document.getElementById('jobTitle').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const location = document.getElementById('location').value.trim();
        const portfolio = document.getElementById('portfolio').value.trim();
        const summary = document.getElementById('summary').value.trim();

        previewName.textContent = fName || 'Your Name';
        previewJobTitle.textContent = jTitle || 'Your Job Title';

        previewEmail.textContent = email;
        toggleVisibility(previewEmailContainer, email);

        previewPhone.textContent = phone;
        toggleVisibility(previewPhoneContainer, phone);

        previewLocation.textContent = location;
        toggleVisibility(previewLocationContainer, location);

        if (portfolio) {
            const safeUrl = portfolio.startsWith('http') ? portfolio : `https://${portfolio}`;
            previewPortfolio.innerHTML = `<a href="${escapeHTML(safeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(portfolio)}</a>`;
            previewPortfolioContainer.style.display = '';
        } else {
            previewPortfolio.innerHTML = '';
            previewPortfolioContainer.style.display = 'none';
        }

        previewSummary.textContent = summary;
        toggleVisibility(previewSummaryContainer, summary);

        updateProgress();
    }

    function updateDynamicPreview() {
        // Experience
        const expCards = experienceList.querySelectorAll('.entry-card');
        previewExperienceList.innerHTML = '';

        if (expCards.length > 0) {
            expCards.forEach(card => {
                const title = card.querySelector('.exp-title').value.trim();
                const company = card.querySelector('.exp-company').value.trim();
                const from = card.querySelector('.exp-from').value.trim();
                const to = card.querySelector('.exp-to').value.trim();
                const desc = card.querySelector('.exp-desc').value.trim();

                if (title || company || from || to || desc) {
                    const html = `
                        <div class="preview-item">
                            <div class="preview-item-header">
                                <span class="preview-item-title">${escapeHTML(title || 'Position Title')}</span>
                                <span class="preview-item-date">${escapeHTML(from || 'Start')} - ${escapeHTML(to || 'End')}</span>
                            </div>
                            <div class="preview-item-subtitle">${escapeHTML(company || 'Company Name')}</div>
                            <div class="preview-item-desc">${escapeHTML(desc)}</div>
                        </div>
                    `;
                    previewExperienceList.insertAdjacentHTML('beforeend', html);
                }
            });
        }

        previewExperienceContainer.style.display =
            previewExperienceList.innerHTML.trim() !== '' ? 'block' : 'none';

        // Education
        const eduCards = educationList.querySelectorAll('.entry-card');
        previewEducationList.innerHTML = '';

        if (eduCards.length > 0) {
            eduCards.forEach(card => {
                const degree = card.querySelector('.edu-degree').value.trim();
                const school = card.querySelector('.edu-school').value.trim();
                const from = card.querySelector('.edu-from').value.trim();
                const to = card.querySelector('.edu-to').value.trim();

                if (degree || school || from || to) {
                    const html = `
                        <div class="preview-item">
                            <div class="preview-item-header">
                                <span class="preview-item-title">${escapeHTML(degree || 'Degree')}</span>
                                <span class="preview-item-date">${escapeHTML(from || 'Start')} - ${escapeHTML(to || 'End')}</span>
                            </div>
                            <div class="preview-item-subtitle">${escapeHTML(school || 'Institution')}</div>
                        </div>
                    `;
                    previewEducationList.insertAdjacentHTML('beforeend', html);
                }
            });
        }

        previewEducationContainer.style.display =
            previewEducationList.innerHTML.trim() !== '' ? 'block' : 'none';

        updateProgress();
    }

    function updateSkillsPreview() {
        previewSkillsList.innerHTML = '';

        if (skills.length > 0) {
            previewSkillsContainer.style.display = 'block';

            skills.forEach(skill => {
                const span = document.createElement('span');
                span.className = 'preview-skill-tag';
                span.textContent = skill;
                previewSkillsList.appendChild(span);
            });
        } else {
            previewSkillsContainer.style.display = 'none';
        }

        updateProgress();
    }

    function renderSkills() {
        skillsContainer.innerHTML = '';

        skills.forEach((skill, index) => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.innerHTML = `
                ${escapeHTML(skill)}
                <i class='bx bx-x' data-index="${index}"></i>
            `;
            skillsContainer.appendChild(chip);
        });

        skillsContainer.querySelectorAll('i').forEach(icon => {
            icon.addEventListener('click', e => {
                const idx = Number(e.target.getAttribute('data-index'));
                skills.splice(idx, 1);
                renderSkills();
                updateSkillsPreview();
            });
        });
    }

    function addDynamicEntry(templateId, listElement) {
        hasInteracted = true;

        const template = document.getElementById(templateId);
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.entry-card');

        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px)';

        listElement.appendChild(clone);

        const newCard = listElement.lastElementChild;
        const inputs = newCard.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('input', updateDynamicPreview);
        });

        const removeBtn = newCard.querySelector('.remove-btn');
        removeBtn.addEventListener('click', e => {
            const entry = e.target.closest('.entry-card');
            entry.style.opacity = '0';
            entry.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                entry.remove();
                updateDynamicPreview();
            }, 300);
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        });

        updateDynamicPreview();
    }

    // Basic fields listeners
    formFields.forEach(field => {
        field.addEventListener('input', updateBasicPreview);
    });

    // Dynamic buttons
    addExperienceBtn.addEventListener('click', () => {
        addDynamicEntry('experienceTemplate', experienceList);
    });

    addEducationBtn.addEventListener('click', () => {
        addDynamicEntry('educationTemplate', educationList);
    });

    // Skills input
    skillInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();

            const val = skillInput.value.trim().replace(/,$/, '');

            if (val && !skills.includes(val)) {
                hasInteracted = true;
                skills.push(val);
                skillInput.value = '';
                renderSkills();
                updateSkillsPreview();
            }
        }
    });

    // Clear form
    clearFormBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the entire form?')) {
            formFields.forEach(field => {
                field.value = '';
            });

            experienceList.innerHTML = '';
            educationList.innerHTML = '';
            skills = [];
            skillInput.value = '';
            hasInteracted = false;

            renderSkills();
            updateBasicPreview();
            updateDynamicPreview();
            updateSkillsPreview();

            progressBar.style.width = '0%';
            progressPercentage.textContent = '0%';
            emptyPreviewState.style.display = 'flex';
            activePreviewContent.style.display = 'none';
        }
    });

    // Download / Print
    downloadPdfBtn.addEventListener('click', () => {
        const resumeContent = document.getElementById('printArea').innerHTML;

        const printWindow = window.open('', '_blank', 'width=900,height=1200');

        printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Resume PDF</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Inter, Arial, sans-serif;
                    background: white;
                    color: #111827;
                }

                .resume-preview-wrapper {
                    width: 100%;
                    max-width: 100%;
                    margin: 0;
                    padding: 0;
                    background: white;
                    box-shadow: none;
                    border: none;
                    border-radius: 0;
                }

                .resume-preview {
                    padding: 32px;
                    background: white;
                    color: #111827;
                }

                .resume-header {
                    border-bottom: 2px solid #5b5cf0;
                    padding-bottom: 16px;
                    margin-bottom: 24px;
                }

                .header-primary h1 {
                    font-size: 32px;
                    margin: 0 0 6px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .header-primary h2 {
                    font-size: 18px;
                    margin: 0 0 14px;
                    color: #5b5cf0;
                    font-weight: 600;
                }

                .header-contact {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px 18px;
                    font-size: 14px;
                    color: #475569;
                }

                .contact-item {
                    display: inline-block;
                }

                .resume-main {
                    display: flex;
                    gap: 28px;
                    align-items: flex-start;
                }

                .resume-column-main {
                    flex: 2;
                }

                .resume-column-aside {
                    flex: 1;
                }

                .resume-section {
                    margin-bottom: 24px;
                }

                .resume-section-title {
                    font-size: 16px;
                    font-weight: 800;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                    padding-bottom: 6px;
                    border-bottom: 1px solid #dbe2ea;
                    color: #111827;
                }

                .summary-text,
                .preview-item-desc {
                    font-size: 14px;
                    line-height: 1.7;
                    color: #475569;
                    white-space: pre-wrap;
                }

                .preview-item {
                    margin-bottom: 16px;
                }

                .preview-item-header {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    margin-bottom: 4px;
                }

                .preview-item-title {
                    font-weight: 700;
                    font-size: 15px;
                    color: #111827;
                }

                .preview-item-date {
                    font-size: 13px;
                    color: #64748b;
                    white-space: nowrap;
                }

                .preview-item-subtitle {
                    font-size: 14px;
                    font-weight: 600;
                    color: #5b5cf0;
                    margin-bottom: 6px;
                }

                .preview-skills-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .preview-skill-tag {
                    display: inline-block;
                    background: #eef2ff;
                    color: #334155;
                    padding: 6px 10px;
                    border-radius: 999px;
                    font-size: 13px;
                    font-weight: 600;
                }

                a {
                    color: #5b5cf0;
                    text-decoration: none;
                }

                @media print {
                    body {
                        margin: 0;
                    }

                    .resume-preview {
                        padding: 20px;
                    }

                    @page {
                        size: A4;
                        margin: 12mm;
                    }
                }
            </style>
        </head>
        <body>
            <div class="resume-preview-wrapper">
                ${resumeContent}
            </div>
            <script>
                window.onload = function () {
                    window.focus();
                    window.print();
                    window.onafterprint = function () {
                        window.close();
                    };
                };
            <\/script>
        </body>
        </html>
    `);

        printWindow.document.close();
    });

    // Initial state
    updateBasicPreview();
    updateDynamicPreview();
    updateSkillsPreview();
});