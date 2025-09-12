import React from 'react';
import Industry from './Industry';
import ResumeChecker from './ResumeChecker/ResumeChecker';

import AnimatedCardGallery from './card/Card';

function Home() {

 

    return (
       <div className='pt-10'>
        <ResumeChecker />
        <Industry />
        <AnimatedCardGallery />
       </div>
    );
}

export default Home;