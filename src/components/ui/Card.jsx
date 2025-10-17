// A highly reusable card component that can be used everywhere.
const Card = ({ title, children, color = '#ADD0B3' }) => (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        {title && (
            <h2 
                className={`text-2xl font-extrabold text-gray-800 mb-6 border-b pb-3 border-l-4 pl-4`}
                style={{ borderLeftColor: color, color: color }}
            >
                {title}
            </h2>
        )}
        {children}
    </div>
);
export default Card;