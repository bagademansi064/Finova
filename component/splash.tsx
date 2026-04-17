import React from 'react'
import BrandLogo from './BrandLogo'

export default function Splash() {
    return (
        <div className='h-screen w-screen bg-[linear-gradient(to_bottom_right,#FFFFFF_0%,#E4FCF0_42%,#D2FAE6_93%)] flex justify-center items-center'>
            <div className='flex flex-col justify-baseline gap-5' >
                <BrandLogo />
                <p className='text-[15px] text-[#00000080] font-bold'>The power of <strong>We</strong> in investing.</p>

                {/* <div className='h-fit w-fit'>
                        <img className='h-32' src="/finovaLogo.png" alt="app-logo" />
                    </div> */}
                {/* <div className='h-32 flex flex-col justify-center items-start'>
                        <h1 className='text-[50px] text-[#0E1B19] font-bold' ><span className='text-[#00695C]'>F</span>Inova</h1>
                        <p className='text-[15px] text-[#00000080] font-bold'>The power of <strong>We</strong> in investing.</p>
                    </div> */}
            </div>
        </div>
    )
}
