import { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { magic } from "../../lib/magic-client";

const NavBar = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState("");

    const router = useRouter();

    useEffect(() => {
      
     async function getUsername() {
        try {
            const { email } = await magic.user.getMetadata();

            if (email) {
                setUsername(email);
            }
        } catch (error) {
            console.error("Error retrieving email: ", error);
        }
      }
      
      getUsername();
    }, []);

    const handleOnClickHome = (e) => {
        e.preventDefault();
        router.push("/");
    }

    const handleOnClickMyList = (e) => {
        e.preventDefault();
        router.push("/browse/my-list");
    }

    const handleShowDropdown = e => {
        e.preventDefault();
        setShowDropdown(!showDropdown);
    }

    const handleSignout = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });
    
          const res = await response.json();
        } catch (error) {
          console.error("Error logging out", error);
          router.push("/login");
        }
      };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <a className={styles.logoLink} href="/">
                    <div className={styles.logoWrapper}>
                       <Image 
                        src="/icons/netflix.svg" 
                        alt="Netflix Logo" 
                        width="128px"
                        height="34px"
                    /> 
                    </div>
                </a>
            <ul className={styles.navItems}>
                <li onClick={handleOnClickHome} className={styles.navItem}>Home</li>
                <li onClick={handleOnClickMyList} className={styles.navItem2}>My List</li>
            </ul>

            <nav className={styles.navContainer}>
                <div>
                    <button onClick={handleShowDropdown} className={styles.usernameBtn}>
                        <p className={styles.username}>{username}</p>
                        <Image 
                            src={"/icons/expand_more.svg"} 
                            alt="Expand More Icon" 
                            width={"24px"}
                            height={"24px"}
                        />
                    </button>

                    { showDropdown && (
                        <div className={styles.navDropdown}>
                        <div>
                            <Link className={styles.linkName} onClick={handleSignout}>Sign Out</Link>
                            <div className={styles.lineWrapper}></div>
                        </div>
                    </div>
                    )}
                </div>
            </nav>
        </div>
        </div>
    );
}

export default NavBar;