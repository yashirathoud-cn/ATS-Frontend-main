import React from 'react';
import Premium from './Premium/Premium';
import Plans from './Plans/Plans';
function Home() {
    return (
       <div className='pt-10'>
        <Premium />
        <Plans />
       </div>
    );
}

export default Home;