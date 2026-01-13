/**
 * Default schemas for each page in the application.
 */
export const PAGE_SCHEMAS = {
    services: {
        hero_section: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' }, buttons: [] },
    },
    home: {
        hero_section: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' }, buttons: [] },
        who_we_are_section: {
            title: { en: '', fr: '', zh: '' },
            sub_title: { en: '', fr: '', zh: '' },
            button: { name: { en: '', fr: '', zh: '' }, link: '' },
            locations: [
                { label: { en: 'France', fr: 'France', zh: '法国' } },
                { label: { en: 'Egypt', fr: 'Égypte', zh: '埃及' } },
                { label: { en: 'China', fr: 'Chine', zh: '中国' } },
            ]
        },
        services_section_title: { en: 'Our Services', fr: '', zh: '' },
        features_section: [],
        cta_section: { title: { en: '', fr: '', zh: '' }, button: { name: { en: '', fr: '', zh: '' }, link: '' } },
        partners_section_title: { en: 'Our Partners', fr: '', zh: '' },
        partners_section: [],
    },
    'about-us': {
        hero_section: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' }, buttons: [] },
        company_purpose: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' }, company_details: [] },
        our_strategic_objectives: [],
        our_strategic_objectives_title: { en: '', fr: '', zh: '' },
    },
    careers: {
        hero_section: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' }, buttons: [] },
        bubbles: [],
        application: {
            name_field_title: { en: '', fr: '', zh: '' },
            email_field_title: { en: '', fr: '', zh: '' },
            phone_title: { en: '', fr: '', zh: '' },
            available_from_title: { en: '', fr: '', zh: '' },
            location_title: { en: '', fr: '', zh: '' },
            expected_salary_title: { en: '', fr: '', zh: '' },
            cv_title: { en: '', fr: '', zh: '' },
            cover_letter_title: { en: '', fr: '', zh: '' },
            employment_reference_title: { en: '', fr: '', zh: '' },
            certificate_title: { en: '', fr: '', zh: '' },
            other_title: { en: '', fr: '', zh: '' },
            submit_button_title: { en: '', fr: '', zh: '' },
        },
    },
    'contact-us': {
        hero_section: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' }, buttons: [] },
        paragraph: { en: '', fr: '', zh: '' },
        form_section: {
            full_name_title: { en: '', fr: '', zh: '' },
            organization_title: { en: '', fr: '', zh: '' },
            email_title: { en: '', fr: '', zh: '' },
            area_of_interest: { field_title: { en: '', fr: '', zh: '' }, field_menu_points: [] },
            i_represent_field: { field_title: { en: '', fr: '', zh: '' }, field_menu_points: [] },
            message_title: { en: '', fr: '', zh: '' },
            submit_button_title: { en: '', fr: '', zh: '' },
        },
        gps_location: '',
    },
    'our-technology': {
        hero_section: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' } },
        solutions_section_title: { en: 'Our Innovative Solutions', fr: 'Nos solutions innovantes', zh: '我们的创新解决方案' },
        solutions_section: [
            {
                title: { en: 'CO₂ \\n+SOLUTIONS', fr: '', zh: '' },
                cards: ['ClathraStore-CO₂™', 'ClathraMove-CO₂™'],
                cardColors: ['#ed7d31', '#1f6d2d'],
                bgFrom: '#e8f5f8',
                bgTo: '#f1faef',
                link: '',
            },
            {
                title: { en: 'BIOMETHANE \\n+SOLUTIONS', fr: '', zh: '' },
                cards: ['ClathraStore-BioCH₄™', 'ClathraMove-BioCH₄™'],
                cardColors: ['#009edb', '#8d3195'],
                bgFrom: '#f0f7fb',
                bgTo: '#f8edfb',
                link: '',
            },
        ],
        gas_separation: {
            title: { en: 'Cryogenic Gas Separation', fr: '', zh: '' },
            sub_title: { en: 'Fractional distillation separating Methane, Carbon Dioxide & Hydrogen via controlled cooling.', fr: '', zh: '' },
            bg_image: '',
            bg_dark_opacity: 0.5,
            bg_light_opacity: 0.2,
            button: {
                title: { en: 'Learn More', fr: '', zh: '' },
                link: '/why-technology',
            },
            gases: [
                { name: { en: 'CH4', fr: '', zh: '' }, color: '#e14b2c' },
                { name: { en: 'CO2', fr: '', zh: '' }, color: '#f5a623' },
                { name: { en: 'H2', fr: '', zh: '' }, color: '#6bbf59' },
            ],
        },
    },
    'biogas-solutions': {
        hero_section: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' } },
        steps: [
            { id: 1, text: { en: 'Biogas Pre-treatment at the Farm', fr: '', zh: '' } },
            { id: 2, text: { en: 'Storing Biogas in compact solid form.', fr: '', zh: '' } },
            { id: 3, text: { en: 'Transport of Solidified Biogas to Central Hub', fr: '', zh: '' } },
            { id: 4, text: { en: 'Centralized Recovery and Purification', fr: '', zh: '' } },
            { id: 5, text: { en: 'Valorization of bioCH₄ and bioCO₂', fr: '', zh: '' } },
            { id: 6, text: { en: 'Agent Recycling and Return to Farms', fr: '', zh: '' } },
        ],
    },
    'why-technology': {
        hero_section: { title: { en: '', fr: '', zh: '' }, sub_title: { en: '', fr: '', zh: '' } },
        solutions_section_title: { en: 'Our Innovative Solutions', fr: '', zh: '' },
        stats_section: { methane_text: { en: '100-170 Nm3 methane / m3', fr: '', zh: '' }, brand_text: 'ClathraEnergiesTM' },
        temp_section: { left_label: 'ClathraEnergiesTM', left_temp: { en: '-20°C', fr: '', zh: '' }, right_label: 'BML', right_temp: { en: '-162°C', fr: '', zh: '' } },
        safe_section: { title: { en: 'Safe and Green Technology', fr: '', zh: '' } },
        economics_section: { capex_text: { en: '25 - 50 % CAPEX', fr: '', zh: '' }, opex_text: { en: '18 - 25 % OPEX', fr: '', zh: '' } },
        solutions_section: [
            {
                title: { en: 'CO₂ \\nSOLUTIONS', fr: '', zh: '' },
                cards: ['ClathraStore-CO₂™', 'ClathraMove-CO₂™'],
                cardColors: ['#ed7d31', '#1f6d2d'],
                bgFrom: '#e8f5f8',
                bgTo: '#f1faef',
                cardLinks: ['', ''],
            },
            {
                title: { en: 'BIOMETHANE \\nSOLUTIONS', fr: '', zh: '' },
                cards: ['ClathraStore-BioCH₄™', 'ClathraMove-BioCH₄™'],
                cardColors: ['#009edb', '#8d3195'],
                bgFrom: '#f0f7fb',
                bgTo: '#f8edfb',
                link: '',
            },
        ],
    },
};
