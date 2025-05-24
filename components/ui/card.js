// components/ui/card.js

export function Card({ children, className = "" }) {
    return <div className={`rounded-xl bg-[#1f1f1f] p-4 shadow ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
    return <div className={className}>{children}</div>;
}
