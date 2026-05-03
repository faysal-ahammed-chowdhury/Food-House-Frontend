"use client";

import Footer from "@/components/riders/footer";
import Header from "@/components/riders/header";
import Sidebar from "@/components/riders/sidebar";
import { use, useState } from "react";
import { z } from "zod";



export default function Profile({ params }: { params: Promise<{ name: string }>}){
     const { name } = use(params);
    return(
    
        <div className="flex flex-col min-h-screen">
            <Header name={name}/>

            <div className="flex flex-1">
            <Sidebar name={name} />
            

            <main className="flex-1 p-6">

            <h1>Profile Change: {name}</h1>

            </main>

            
        </div>
        <Footer/>
        </div>
        
    );
}