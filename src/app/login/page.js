"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, LogIn, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function LoginPage() {
  const { lang } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = login(email, password);
      if (success) {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className={styles.section}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <motion.div
                className={styles.iconWrapper}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <User size={40} />
              </motion.div>
              <h1 className={styles.title}>
                Login
              </h1>
              <p className={styles.subtitle}>
                Welcome back! Please login to continue your journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Email
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.togglePassword}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <div className={styles.loader} />
                ) : (
                  <>
                    <LogIn size={18} />
                    Login
                  </>
                )}
              </motion.button>

              <div className={styles.divider}>
                <span className={styles.dividerText}>
                  or
                </span>
              </div>

              <p className={styles.registerText}>
                Don't have an account? 
                <Link href="/register" className={styles.registerLink}>
                  Sign Up
                </Link>
              </p>
            </form>
          </div>

          <div className={styles.illustration}>
            <motion.div
              className={styles.illustrationInner}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className={styles.illustrationShape1} />
              <div className={styles.illustrationShape2} />
              <div className={styles.illustrationContent}>
                <h2 className={styles.illustrationTitle}>
                  Discover the Best of Egypt!
                </h2>
                <p className={styles.illustrationText}>
                  Login now for a personalized experience and save your favorite trips.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
