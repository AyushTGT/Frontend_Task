import React from "react";
import { Link, useLocation } from "react-router-dom";

const routes = [
    {
        label: 'Home',
        href: '/home',
    }
];

export default function Navigation() {
    const location = useLocation();

    return (
        <nav>
            <ul>
                {routes.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <li key={item.href}>
                            <Link
                                to={item.href}
                                style={{ fontWeight: isActive ? 'bold' : 'normal' }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}