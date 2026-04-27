"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assets/Logo.png";

const DOT_SIZE = 22;
const RED = "#C0392B";
const RED_GLOW = "rgba(192,57,43,0.22)";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [introState, setIntroState] = useState("idle");
  const introPlayedRef = useRef(false);
  const pillRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const checkAuth = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try { setUserType(jwtDecode(token).usertype); }
      catch { setUserType(null); }
    } else { setUserType(null); }
  };

  useEffect(() => {
    checkAuth();
    const h = () => checkAuth();
    window.addEventListener("storage", h);
    window.addEventListener("authChanged", h);
    return () => {
      window.removeEventListener("storage", h);
      window.removeEventListener("authChanged", h);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserType(null);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  // intro animation — once on mount
  useEffect(() => {
    if (introPlayedRef.current) return;
    introPlayedRef.current = true;
    const t1 = setTimeout(() => {
      setIntroState("expanding");
      const t2 = setTimeout(() => {
        setIntroState("collapsing");
        const t3 = setTimeout(() => setIntroState("idle"), 440);
        return () => clearTimeout(t3);
      }, 860);
      return () => clearTimeout(t2);
    }, 600);
    return () => clearTimeout(t1);
  }, []);

  // nav items
  const normalNavItems = [
    { name: "Accueil", link: "/" },
    { name: "À propos", link: "/about" },
    { name: "Produits", link: "/products" },
    { name: "Contact", link: "/sell-us-something" },
  ];
  const adminNavItems = [
    { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Cars", link: "/admin/cars" },
    { name: "Galerie", link: "/admin/gallery" },
  ];
  const superadminNavItems = [
    { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Utilisateurs", link: "/admin/users" },
    { name: "Cars", link: "/admin/cars" },
    { name: "Noms", link: "/admin/car-names" },
    { name: "Galerie", link: "/admin/gallery" },
    { name: "Messages", link: "/admin/contacts" },
  ];

  const navItems =
    userType === "superadmin" ? superadminNavItems :
    userType === "admin" ? adminNavItems :
    normalNavItems;

  const isAdmin = userType === "admin" || userType === "superadmin";
  const isExpanded = open || introState === "expanding";
  const introDone = introState === "idle";

  // pill width adapts to item count
  const pillWidth = isAdmin
    ? (userType === "superadmin" ? 820 : 640)
    : 620;

  const pillAnimate = (() => {
    if (introState === "expanding") {
      return isMobile
        ? { width: "92vw", height: "auto", borderRadius: 20 }
        : { width: pillWidth, height: 64, borderRadius: 32 };
    }
    if (open) {
      return isMobile
        ? { width: "92vw", height: "auto", borderRadius: 20 }
        : { width: pillWidth, height: 64, borderRadius: 32 };
    }
    return { width: DOT_SIZE, height: DOT_SIZE, borderRadius: 999 };
  })();

  const pillTransition = (() => {
    if (introState === "expanding") return { type: "spring", stiffness: 255, damping: 23 };
    if (introState === "collapsing") return { type: "spring", stiffness: 340, damping: 30 };
    return { type: "spring", stiffness: 280, damping: 28 };
  })();

  const shellStyle = isMobile
    ? { position: "fixed", top: 16, right: 16, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end" }
    : { position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center" };

  return (
    <div style={shellStyle}>
      <motion.div
        ref={pillRef}
        onClick={() => { if (!open && introDone) setOpen(true); }}
        animate={pillAnimate}
        transition={pillTransition}
        style={{
          background: isExpanded ? "#1a0a09" : RED,
          overflow: "hidden",
          cursor: isExpanded ? "default" : "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isExpanded
            ? `0 12px 48px rgba(192,57,43,0.28), 0 0 0 1px rgba(192,57,43,0.18)`
            : `0 0 0 5px ${RED_GLOW}, 0 4px 18px rgba(192,57,43,0.38)`,
        }}
      >
        {/* Pulse rings */}
        <AnimatePresence>
          {!open && introDone && (
            <>
              <motion.div key="p1"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 3.6, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: RED, pointerEvents: "none" }}
              />
              <motion.div key="p2"
                initial={{ scale: 1, opacity: 0.28 }}
                animate={{ scale: 2.9, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: RED, pointerEvents: "none" }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Bottom accent stripe */}
        <AnimatePresence>
          {isExpanded && !isMobile && (
            <motion.div key="stripe"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.6, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              style={{
                position: "absolute", bottom: 0, left: "12%", width: "76%", height: 2,
                background: `linear-gradient(90deg, transparent, ${RED}, #e74c3c, transparent)`,
                borderRadius: 2, pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        {/* ── DESKTOP inner ── */}
        <AnimatePresence>
          {isExpanded && !isMobile && (
            <motion.div key="desk"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.18, duration: 0.22 }}
              style={{
                display: "flex", alignItems: "center",
                width: "100%", padding: "0 6px 0 16px",
                whiteSpace: "nowrap", gap: 0, height: 64,
              }}
            >
              <LogoMark />
              <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.1)", margin: "0 10px", flexShrink: 0 }} />
              <nav style={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                {navItems.map((item) => (
                  <NavLink key={item.link} item={item} active={location.pathname === item.link} />
                ))}
              </nav>
              {isAdmin && <LogoutBtn onClick={handleLogout} />}
              <CloseBtn onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MOBILE inner ── */}
        <AnimatePresence>
          {isExpanded && isMobile && (
            <motion.div key="mob"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.18, duration: 0.22 }}
              style={{ width: "100%", padding: "16px 16px 18px" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <LogoMark />
                <CloseBtn onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 12 }}>
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.link}
                    item={item}
                    active={location.pathname === item.link}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
              {isAdmin && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <LogoutBtn mobile onClick={handleLogout} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function LogoMark() {
  return (
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%",
        background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 0 0 2px rgba(192,57,43,0.25)",
      }}>
        <img src={Logo} alt="Logo" style={{ width: 22, height: 22, objectFit: "contain" }} />
      </div>
      <span style={{
        fontSize: 14, fontWeight: 700, color: "#fff",
        letterSpacing: "0.02em", fontFamily: "inherit",
      }}>
        Auto<span style={{ color: "#e74c3c" }}>Shop</span>
      </span>
    </Link>
  );
}

function NavLink({ item, active }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={item.link}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 13, fontWeight: 500,
        color: active || hov ? "#fff" : "rgba(255,255,255,0.55)",
        background: active
          ? "rgba(192,57,43,0.35)"
          : hov ? "rgba(255,255,255,0.07)" : "transparent",
        textDecoration: "none",
        padding: "6px 11px", borderRadius: 20,
        transition: "color .18s, background .18s",
        whiteSpace: "nowrap",
      }}
    >
      {item.name}
    </Link>
  );
}

function MobileNavLink({ item, active, onClick }) {
  return (
    <Link
      to={item.link}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: 15, fontWeight: 500,
        color: active ? "#fff" : "rgba(255,255,255,0.62)",
        background: active ? "rgba(192,57,43,0.28)" : "transparent",
        textDecoration: "none",
        padding: "11px 13px", borderRadius: 13,
        transition: "color .18s, background .18s",
      }}
    >
      {item.name}
      <span style={{ opacity: active ? 0.9 : 0.3, color: active ? "#e74c3c" : "inherit", fontSize: 14 }}>›</span>
    </Link>
  );
}

function LogoutBtn({ onClick, mobile = false }) {
  return (
    <button onClick={onClick} style={{
      background: "rgba(192,57,43,0.16)",
      color: "#e74c3c",
      border: "1px solid rgba(192,57,43,0.32)",
      borderRadius: mobile ? 13 : 20,
      padding: mobile ? "12px 0" : "7px 14px",
      width: mobile ? "100%" : "auto",
      fontSize: mobile ? 14 : 12,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "background .18s",
      ...(mobile ? {} : { marginRight: 6, flexShrink: 0 }),
    }}>
      Déconnexion
    </button>
  );
}

function CloseBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, borderRadius: "50%", border: "none",
        background: hov ? "rgba(192,57,43,0.28)" : "rgba(255,255,255,0.07)",
        color: hov ? "#e74c3c" : "rgba(255,255,255,0.45)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginRight: 4,
        transition: "background .18s, color .18s",
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}