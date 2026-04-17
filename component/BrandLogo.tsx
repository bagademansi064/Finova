import React from 'react';

export default function BrandLogo({ className = "" }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <img src="/finovaLogo.png" alt="Finova Logo" className=" lg:h-20 md:h-20 h-10" />
            <span className="lg:text-3xl md:text-3xl text-2xl font-bold tracking-tight text-[#0E1B19]">
                <h1 ><span className='text-[#00695C]'>F</span>Inova</h1>
            </span>
        </div>
    );
}