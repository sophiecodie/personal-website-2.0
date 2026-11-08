"use client";
import { useEffect } from "react";
import { startChoreography } from "@/lib/choreography";

/** The fixed particle canvas behind the whole page. */
export default function Choreography() {
  useEffect(() => startChoreography(), []);
  return <canvas id="fx" aria-hidden="true" />;
}
