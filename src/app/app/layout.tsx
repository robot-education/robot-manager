"use client";
import React from "react";
import { AppNavbar } from "./_navbar/app-navbar";
import { OnshapeParamsProvider } from "@/common/onshape-params";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";

export default function App(props: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <OnshapeParamsProvider>
                <AppNavbar />
                {props.children}
            </OnshapeParamsProvider>
        </QueryClientProvider>
    );
}
