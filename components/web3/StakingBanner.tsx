import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';

// Add props to the component, including ImageProps for type safety
const StakingBanner: React.FC<ImageProps> = (props) => (


    <>

        <Card className="bg-white bg-opacity-20 rounded-b-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 overflow-hidden mt-24 md:mt-28 ">
            <CardContent className="p-0 relative">
                <div className="relative h-[200px] md:h-[500px] w-full">
                    <Image
                        {...props} // Spread the props onto the Image component

                    />

                </div>

            </CardContent>

        </Card>
        <div className="inset-0 mt-10 bg-opacity-40 flex flex-col items-center justify-center md:px-20 ">
            <h1 className="text-4xl font-bold text-white tracking-wider text-center  mt-10 md:mt-20 mb-4">
                Welcome to Other Italy
            </h1>
            <p className="text-lg text-white text-center mt-4 mb-10 ">
                <strong>OTHER ITALY</strong> is the Italian community of all Yuga asset. We focus on various aspects one of the main ones is gaming. In fact, we are structured by specialty in every branch and sector where Yuga assets are involved. In addition, we tell stories through our comics by joining with other projects and MBAs in addition to organizing IRL events.
                <br />  <br />
                The Other Italy membership token It’s a free mint, and allow you to be part of an even smaller and closer-knit community, it is not enough to be a Yuga asset holder to have it you must be chosen and selected as a commendable member of the same team in order to have the opportunity to be part of the Club.
                <br />  <br />
                Needless to say, our token will give you access to some exclusive “things” 🤣
            </p>
            <Link href="/mint" className=" mb-40 px-6 py-2 bg-[#000C54] text-white rounded hover:opacity-70 transition">
                Mint your membership Now
            </Link>
        </div>

    </>
);

export default StakingBanner; 