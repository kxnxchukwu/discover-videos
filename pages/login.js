import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css'
import { magic } from "../lib/magic-client";

const Login = () => {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [userMsg, setUserMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleComplete = () => {
            setIsLoading(false);
        }

        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete)

        return () => {
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };

    }, [router]);

    const handleEmailChange = e => {
        e.preventDefault();
        setUserMsg("")
        const email = e.target.value;
        setEmail(email);
    }

    const handleLoginWithEmail = async (e) => {
        e.preventDefault();
        if (email) {
                try {
                    setIsLoading(true);
                   const didToken = await magic.auth.loginWithMagicLink({email});
                   if(didToken) {
                    const response = await fetch("/api/login", {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${didToken}`,
                          "Content-Type": "application/json",
                        },
                      });

                    const loggedInResponse = await response.json();

                    if (loggedInResponse.done) {
                        router.push("/");
                    } else {
                        setIsLoading(false);
                        setUserMsg("Something went wrong logging you in");
                    }
                   }
                } catch (error) {
                    console.error({error})
                    setUserMsg("Uh Oh! Something went wrong logging you in");
                }
        } else {
            setIsLoading(false);
            setUserMsg("Please Enter a Valid Email Address");
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix Sign In</title>
            </Head>
            <header className={styles.header}>
            <div className={styles.headerWrapper}>
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
            </div>
            </header>
            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                <h1 className={styles.signinHeader}>Sign In</h1>
                <input
                    type="email"
                    placeholder="Email Address"
                    className={styles.emailInput}
                    onChange={handleEmailChange}
                />

                <p className={styles.userMsg}>{userMsg}</p>
                <button 
                    onClick={handleLoginWithEmail}
                    className={styles.loginBtn}>
                        {isLoading ? "Loading..." : "Sign In"}
                </button>
                </div>
            </main>
        </div>
    );
}

export default Login;