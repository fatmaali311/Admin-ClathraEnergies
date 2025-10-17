// Reusable component for any page that requires sidebar navigation/tabs.
const SidebarNavigation = ({ sections, activeSection, setActiveSection, primaryColor = '#388E3C' }) => {
    return (
        <div className="sticky top-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 space-y-2">
            {sections.map((section) => (
                <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-lg
                        ${activeSection === section.id 
                            ? `text-white shadow-md` 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    style={{ backgroundColor: activeSection === section.id ? primaryColor : 'transparent' }}
                >
                    {section.title}
                </button>
            ))}
        </div>
    );
};
export default SidebarNavigation;