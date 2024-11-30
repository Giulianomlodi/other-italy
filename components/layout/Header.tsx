import React from "react";
import styles from "@/app/styles/header.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image"; // Add this import



const ClientSideMenu = dynamic(() => import("./ClientSideMenu"), {
  ssr: false
});

function Header() {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.stickyHeader}>
        <div className={styles.leftArea}>
          <span className={styles.LogoClass}>
            <Link scroll={true} href="/">
              <Image src="/images/OtherIta.png" alt="Logo" width={50} height={50} />
            </Link>
          </span>
        </div>
        <div className={styles.rightArea}>
          <ClientSideMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
