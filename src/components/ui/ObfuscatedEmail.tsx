"use client";

import { useEffect, useState } from "react";

interface ObfuscatedEmailProps {
  className?: string;
}

export function ObfuscatedEmail({ className }: ObfuscatedEmailProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = "bdangi450";
    const domain = "gmail.com";
    const timer = setTimeout(() => {
      setEmail(`${user}@${domain}`);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!email) {
    // Show safe obfuscated placeholder while loading on server/client hydration
    return (
      <span className={className} aria-label="Email contact address">
        bdangi450 [at] gmail [dot] com
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
