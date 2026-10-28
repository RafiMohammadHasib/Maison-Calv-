"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Layers,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  X,
  MapPin,
  ExternalLink,
  Send,
  Grid3x3,
  RefreshCw,
} from "lucide-react";
import { Language } from "@/data/content";

interface InstagramGalleryProps {
  language: Language;
}

const PROFILE = {
  username: "maisoncalvebordeaux",
  fullName: "Maison Calvé · Coworking Bordeaux",
  postsCount: 17,
  followersCount: 480,
  followingCount: 12,
  profileUrl: "https://www.instagram.com/maisoncalvebordeaux/",
  avatarImage: "/images/instagram/insta-media-10.jpg",
  bioLines: {
    fr: [
      "Hôtel particulier d'exception & Coworking haut de gamme",
      "Bureaux privatifs · Open space calme · Salle de réunion",
      "Cour privative sécurisée avec 9 places de parking",
      "📍 48 rue Calvé, 33000 Bordeaux Fondaudège",
    ],
    en: [
      "19th-century private mansion & High-end coworking sanctuary",
      "Private office suites · Serene open space · Executive boardroom",
      "Gated private courtyard with 9 reserved parking bays",
      "📍 48 rue Calvé, 33000 Bordeaux Fondaudège",
    ],
    es: [
      "Palacete histórico & Coworking de alta gama en Burdeos",
      "Despachos privados · Open space silencioso · Sala de reuniones",
      "Patio privado cerrado con 9 plazas de aparcamiento",
      "📍 48 rue Calvé, 33000 Burdeos Fondaudège",
    ],
  },
};

interface InstagramPost {
  id: string;
  image: string;
  type: "single" | "carousel";
  slidesCount?: number;
  likes: number;
  commentsCount: number;
  location: string;
  timeAgo: {
    fr: string;
    en: string;
    es: string;
  };
  caption: {
    fr: string;
    en: string;
    es: string;
  };
  tags: string[];
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "post_1",
    image: "/images/instagram/insta-media-103.jpg",
    type: "carousel",
    slidesCount: 3,
    likes: 64,
    commentsCount: 7,
    location: "Rue Fondaudège, Bordeaux",
    timeAgo: {
      fr: "Il y a 2 jours",
      en: "2 days ago",
      es: "Hace 2 días",
    },
    caption: {
      fr: "Un bon matcha latte avant d'attaquer la journée au 48 rue Calvé ! À deux pas du tramway D (station Fondaudège Muséum). Qui a testé notre sélection de boissons chaudes ? 🍵✨",
      en: "A fresh matcha latte before kicking off the workday at 48 rue Calvé! Steps away from tram line D (Fondaudège Muséum station). 🍵✨",
      es: "¡Un matcha latte fresco antes de comenzar la jornada en el 48 rue Calvé! A solo unos pasos del tranvía D. 🍵✨",
    },
    tags: ["#MaisonCalve", "#BordeauxFondaudege", "#CoworkingBordeaux", "#MatchaLatte"],
  },
  {
    id: "post_2",
    image: "/images/instagram/insta-media-10.jpg",
    type: "single",
    likes: 82,
    commentsCount: 9,
    location: "Maison Calvé, Bordeaux",
    timeAgo: {
      fr: "Il y a 4 jours",
      en: "4 days ago",
      es: "Hace 4 días",
    },
    caption: {
      fr: "Café fraîchement moulu de torréfacteur local, thés bio et infusions à volonté pour tous nos résidents et coworkers. Parce que le confort au quotidien fait toute la différence. ☕️",
      en: "Freshly ground local roasted coffee, organic teas, and refreshments available unlimited for all members. Daily comfort matters. ☕️",
      es: "Café de barista recién molido de tostador local y tés ecológicos ilimitados para todos nuestros miembros. ☕️",
    },
    tags: ["#CafeSpecialite", "#CoworkingBordeaux", "#CoffeeBreak", "#MaisonCalve"],
  },
  {
    id: "post_3",
    image: "/images/instagram/insta-media-110.jpg",
    type: "carousel",
    slidesCount: 4,
    likes: 71,
    commentsCount: 5,
    location: "Maison Calvé — Open Space",
    timeAgo: {
      fr: "Il y a 6 jours",
      en: "6 days ago",
      es: "Hace 6 días",
    },
    caption: {
      fr: "Chaque open space est limité à 5 postes pour garantir un calme absolu et une concentration optimale. Pierre blonde bordelaise apparente et parquet d'époque. Quelques postes encore disponibles ! 🌿",
      en: "Each open space is limited to 5 desks to preserve absolute acoustic calm and deep focus. Exposed limestone and authentic parquet. 🌿",
      es: "Cada espacio abierto está limitado a 5 puestos para garantizar máxima calma y concentración. Piedra vista y parqué auténtico. 🌿",
    },
    tags: ["#OpenSpace", "#PosteFixe", "#CoworkingCalme", "#Bordeaux"],
  },
  {
    id: "post_4",
    image: "/images/instagram/insta-media-100.jpg",
    type: "single",
    likes: 56,
    commentsCount: 4,
    location: "Maison Calvé — Cuisine Équipée",
    timeAgo: {
      fr: "Il y a 1 semaine",
      en: "1 week ago",
      es: "Hace 1 semana",
    },
    caption: {
      fr: "La cuisine des résidents : un lieu moderne, chaleureux et tout équipé pour déconnecter, partager un déjeuner ou un café entre professionnels. Réfrigérateur, micro-ondes, lave-vaisselle et convivialité garantie. 🍽️",
      en: "The resident kitchen: modern, warm, and fully equipped to relax, share lunch, or chat with fellow entrepreneurs. 🍽️",
      es: "La cocina de los residentes: moderna, acogedora y totalmente equipada para compartir el almuerzo o un café con profesionales. 🍽️",
    },
    tags: ["#CuisineEquipee", "#EspaceConvivial", "#MaisonCalveBordeaux"],
  },
  {
    id: "post_5",
    image: "/images/instagram/insta-media-112.jpg",
    type: "carousel",
    slidesCount: 3,
    likes: 93,
    commentsCount: 11,
    location: "Maison Calvé — Salle de Réunion",
    timeAgo: {
      fr: "Il y a 1 semaine",
      en: "1 week ago",
      es: "Hace 1 semana",
    },
    caption: {
      fr: "Notre salle de réunion de 30 m² : écran 4K visioconférence, grande table de réunion, prises intégrées et pause café offerte. Disponible à la demi-journée ou journée complète en plein centre de Bordeaux. 💼",
      en: "Our 30 sqm executive meeting room: 4K presentation display, video-conferencing, integrated power hubs, and complimentary coffee. Available for half-day or full day bookings. 💼",
      es: "Nuestra sala de reuniones de 30 m²: pantalla 4K con videoconferencia, amplia mesa y café incluido. Disponible para media jornada o día completo. 💼",
    },
    tags: ["#SalleDeReunion", "#SeminaireBordeaux", "#ReunionEntreprise", "#MaisonCalve"],
  },
  {
    id: "post_6",
    image: "/images/instagram/insta-media-101.jpg",
    type: "single",
    likes: 47,
    commentsCount: 3,
    location: "48 rue Calvé, Bordeaux",
    timeAgo: {
      fr: "Il y a 2 semaines",
      en: "2 weeks ago",
      es: "Hace 2 semanas",
    },
    caption: {
      fr: "Signalétique sobre et élégante au cœur de la Maison Calvé. Un lieu pensé dans les moindres détails pour les professionnels exigeants. 🧭",
      en: "Minimal and refined architectural signage at Maison Calvé. Crafted with care for exacting professionals. 🧭",
      es: "Señalética sobria y elegante en el corazón de Maison Calvé. Espacios diseñados con el máximo cuidado. 🧭",
    },
    tags: ["#DesignInterieur", "#ArchitectureBordeaux", "#HôtelParticulier"],
  },
  {
    id: "post_7",
    image: "/images/instagram/insta-media-104.jpg",
    type: "single",
    likes: 68,
    commentsCount: 6,
    location: "Arrêt Tram D, Bordeaux",
    timeAgo: {
      fr: "Il y a 2 semaines",
      en: "2 weeks ago",
      es: "Hace 2 semanas",
    },
    caption: {
      fr: "Accès immédiat par le Tram D : à 2 minutes à pied de la Maison Calvé ! Connexion express avec les Quinconces, la Gare Saint-Jean et Mérignac. La mobilité sans contrainte. 🚊",
      en: "Effortless transit via Tram Line D: only 2 minutes on foot to Maison Calvé! Direct link to Place des Quinconces and Saint-Jean Station. 🚊",
      es: "Acceso inmediato mediante el tranvía D: ¡a 2 minutos a pie de Maison Calvé! Conexión directa con Quinconces y la Estación Saint-Jean. 🚊",
    },
    tags: ["#TramDBordeaux", "#MobiliteBordeaux", "#QuartierFondaudege"],
  },
  {
    id: "post_8",
    image: "/images/instagram/insta-media-107.jpg",
    type: "single",
    likes: 54,
    commentsCount: 4,
    location: "Quartier Fondaudège, Bordeaux",
    timeAgo: {
      fr: "Il y a 3 semaines",
      en: "3 weeks ago",
      es: "Hace 3 semanas",
    },
    caption: {
      fr: "« Parfois on recherche simplement un lieu où l'on peut travailler tranquillement. » Bureaux privatifs et open spaces au 48 rue Calvé. Réservez votre visite privée dès aujourd'hui ! 📍",
      en: "“Sometimes you just need a quiet place where you can work in peace.” Private offices and open spaces at 48 rue Calvé. Book your tour today! 📍",
      es: "“A veces simplemente buscas un lugar donde trabajar con total tranquilidad.” Despachos y open spaces en el 48 rue Calvé. ¡Reserve su visita! 📍",
    },
    tags: ["#AffichageBordeaux", "#BureauxBordeaux", "#Coworking"],
  },
  {
    id: "post_9",
    image: "/images/instagram/insta-media-106.jpg",
    type: "single",
    likes: 61,
    commentsCount: 5,
    location: "48 rue Calvé, Bordeaux",
    timeAgo: {
      fr: "Il y a 3 semaines",
      en: "3 weeks ago",
      es: "Hace 3 semanas",
    },
    caption: {
      fr: "Badge sécurisé individuel pour chaque coworker résident : accédez en toute liberté 24h/24 et 7j/7 à vos bureaux, à la cuisine équipée et à la cour intérieure. 🔐",
      en: "Personal secure keyfob for every resident member: 24/7 keyless access to your office suites, kitchen, and courtyard. 🔐",
      es: "Tarjeta de acceso individual para cada miembro: acceso autónomo 24/7 a sus oficinas, cocina y patio. 🔐",
    },
    tags: ["#Acces247", "#Securite", "#EspaceDeTravail"],
  },
  {
    id: "post_10",
    image: "/images/instagram/insta-media-102.jpg",
    type: "single",
    likes: 88,
    commentsCount: 8,
    location: "48 rue Calvé, Bordeaux",
    timeAgo: {
      fr: "Il y a 3 semaines",
      en: "3 weeks ago",
      es: "Hace 3 semanas",
    },
    caption: {
      fr: "« Près de chez toi » — Un écosystème à taille humaine pensé pour votre épanouissement au cœur du quartier Fondaudège. Bienvenue à la Maison Calvé ! 🌿✨",
      en: "“Close to home” — A human-scale workspace crafted for your daily fulfillment in the Fondaudège district. Welcome to Maison Calvé! 🌿✨",
      es: "“Cerca de ti” — Un espacio a escala humana pensado para su desarrollo en el corazón de Fondaudège. ¡Bienvenidos a Maison Calvé! 🌿✨",
    },
    tags: ["#MaisonCalve", "#PresDeChezToi", "#BordeauxFondaudege", "#CoworkingBordeaux"],
  },
];

export default function InstagramGallery({ language }: InstagramGalleryProps) {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [newComments, setNewComments] = useState<Record<string, string[]>>({});
  const [commentInput, setCommentInput] = useState("");
  const [showHeartAnim, setShowHeartAnim] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    INSTAGRAM_POSTS.forEach((p) => {
      initialLikes[p.id] = p.likes;
    });
    setLikeCounts(initialLikes);
  }, []);

  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = !!likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isLiked ? -1 : 1),
    }));

    if (!isLiked) {
      setShowHeartAnim(postId);
      setTimeout(() => setShowHeartAnim(null), 800);
    }
  };

  const handleDoubleClick = (postId: string) => {
    if (!likedPosts[postId]) {
      handleToggleLike(postId);
    } else {
      setShowHeartAnim(postId);
      setTimeout(() => setShowHeartAnim(null), 800);
    }
  };

  const handleToggleSave = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setNewComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), commentInput.trim()],
    }));
    setCommentInput("");
  };

  const t = {
    fr: {
      tag: "Vrai Quotidien — Instagram",
      title: "La Maison Calvé sur Instagram",
      subtitle:
        "Découvrez l'ambiance authentique, les espaces de travail et le quotidien de notre communauté bordelaise.",
      follow: "S'abonner",
      message: "Message",
      refreshTooltip: "Actualiser le flux en direct",
      posts: "publications",
      followers: "abonnés",
      following: "abonnements",
      gridTitle: "Publications récentes",
      gridSubtitle: "Sélection en direct du compte @maisoncalvebordeaux",
      viewProfile: "Voir le profil Instagram",
      viewAllInstagram: "Tout voir sur Instagram",
      addCommentPlaceholder: "Ajouter un commentaire...",
      publish: "Publier",
      viewOriginal: "Voir la publication originale sur Instagram",
      ctaFollow: "Suivez nos actualités et la vie de la Maison en temps réel.",
      ctaConsult: "Consultez l'ensemble de nos publications et reportages photos sur Instagram.",
      openInstagram: "Ouvrir @maisoncalvebordeaux",
    },
    en: {
      tag: "Authentic Life — Instagram",
      title: "Maison Calvé on Instagram",
      subtitle:
        "Experience the authentic atmosphere, workspaces, and daily rhythm of our community in Bordeaux.",
      follow: "Follow",
      message: "Message",
      refreshTooltip: "Refresh live feed",
      posts: "posts",
      followers: "followers",
      following: "following",
      gridTitle: "Recent Publications",
      gridSubtitle: "Live selection from @maisoncalvebordeaux",
      viewProfile: "View Instagram Profile",
      viewAllInstagram: "View all on Instagram",
      addCommentPlaceholder: "Add a comment...",
      publish: "Post",
      viewOriginal: "View original post on Instagram",
      ctaFollow: "Follow our updates and community daily life in real time.",
      ctaConsult: "Explore all our photo shoots and stories on Instagram.",
      openInstagram: "Open @maisoncalvebordeaux",
    },
    es: {
      tag: "Vida Real — Instagram",
      title: "Maison Calvé en Instagram",
      subtitle:
        "Descubra el ambiente auténtico, los espacios de trabajo y el día a día de nuestra comunidad en Burdeos.",
      follow: "Seguir",
      message: "Mensaje",
      refreshTooltip: "Actualizar publicaciones en directo",
      posts: "publicaciones",
      followers: "seguidores",
      following: "seguidos",
      gridTitle: "Publicaciones recientes",
      gridSubtitle: "Selección en directo de la cuenta @maisoncalvebordeaux",
      viewProfile: "Ver perfil de Instagram",
      viewAllInstagram: "Ver todo en Instagram",
      addCommentPlaceholder: "Añadir un comentario...",
      publish: "Publicar",
      viewOriginal: "Ver publicación original en Instagram",
      ctaFollow: "Siga nuestras novedades y la vida de la Maison en tiempo real.",
      ctaConsult: "Consulte todas nuestras publicaciones y reportajes en Instagram.",
      openInstagram: "Abrir @maisoncalvebordeaux",
    },
  }[language];

  return (
    <section id="photos" className="py-12 sm:py-16 bg-white border-t border-calve-border/60 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-calve-slate/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 relative z-10">
        {/* Section Header Badge */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-calve-stone text-xs font-semibold uppercase tracking-wider text-calve-slate mb-3 border border-calve-border shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-calve-charcoal leading-tight tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-calve-muted mt-3 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* ========================================================== */}
        {/* OFFICIAL INSTAGRAM PROFILE HEADER (LIKE GOIZET GESTION)    */}
        {/* ========================================================== */}
        <div className="bg-calve-cream/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 border border-calve-border shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 lg:gap-10">
            {/* Profile Avatar with Story Gradient Ring */}
            <div className="relative shrink-0">
              <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
                <div className="p-1 bg-white rounded-full">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-calve-stone flex items-center justify-center overflow-hidden border border-calve-border">
                    <img
                      src={PROFILE.avatarImage}
                      alt="Maison Calvé Instagram Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="absolute bottom-1 right-1 bg-calve-slate text-white p-1.5 rounded-full border-2 border-white shadow-xs">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            {/* Profile Meta & Actions */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-calve-charcoal tracking-tight lowercase">
                    {PROFILE.username}
                  </h3>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <a
                    href={PROFILE.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-calve-slate hover:bg-calve-slate-dark text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs hover:shadow-md flex items-center space-x-2 group cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>{t.follow}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                  </a>

                  <a
                    href="mailto:contact@maisoncalve.fr"
                    className="bg-white hover:bg-calve-stone text-calve-charcoal border border-calve-border px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-2xs"
                  >
                    <span>{t.message}</span>
                  </a>

                  <button
                    onClick={handleRefreshFeed}
                    title={t.refreshTooltip}
                    className="p-2.5 rounded-full bg-white hover:bg-calve-stone border border-calve-border text-calve-charcoal hover:text-calve-slate transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-calve-slate" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Exact Stats */}
              <div className="flex items-center justify-center md:justify-start space-x-6 sm:space-x-8 text-sm text-calve-charcoal pt-1">
                <div>
                  <span className="font-extrabold">{PROFILE.postsCount}</span>{" "}
                  <span className="text-calve-muted text-xs">{t.posts}</span>
                </div>
                <div>
                  <span className="font-extrabold">{PROFILE.followersCount}</span>{" "}
                  <span className="text-calve-muted text-xs">{t.followers}</span>
                </div>
                <div>
                  <span className="font-extrabold">{PROFILE.followingCount}</span>{" "}
                  <span className="text-calve-muted text-xs">{t.following}</span>
                </div>
              </div>

              {/* Bio Lines */}
              <div className="space-y-1 text-xs sm:text-sm text-calve-charcoal leading-relaxed pt-1 max-w-xl">
                {PROFILE.bioLines[language].map((line, idx) => (
                  <p
                    key={idx}
                    className={idx === 0 ? "font-bold text-calve-charcoal" : "text-calve-charcoal/80"}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* GRID HEADER & REAL POSTS GRID (GOIZET GESTION STYLE)       */}
        {/* ========================================================== */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-calve-border pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-calve-charcoal text-white">
                <Grid3x3 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-calve-charcoal tracking-tight">
                  {t.gridTitle}
                </h3>
                <p className="text-xs text-calve-muted">
                  {t.gridSubtitle}
                </p>
              </div>
            </div>

            <a
              href={PROFILE.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-calve-slate hover:text-calve-charcoal flex items-center gap-1.5 transition-colors"
            >
              <span>{t.viewAllInstagram}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* 10-Grid Responsive Instagram Mosaic (2 x 5 on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {INSTAGRAM_POSTS.map((post) => {
              const isLiked = !!likedPosts[post.id];
              const likes = likeCounts[post.id] ?? post.likes;
              const comments = (newComments[post.id]?.length || 0) + post.commentsCount;

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  onDoubleClick={() => handleDoubleClick(post.id)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-calve-border shadow-xs hover:shadow-md cursor-pointer transition-all duration-300"
                >
                  <img
                    src={post.image}
                    alt={post.caption[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out select-none"
                  />

                  {/* Carousel Badge in Top Right */}
                  {post.type === "carousel" && (
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-white">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Hover Overlay with Likes, Comments Counter & Location Pill */}
                  <div className="absolute inset-0 bg-calve-charcoal/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-2.5 text-white select-none p-3 text-center">
                    <div className="flex items-center space-x-3.5 font-bold text-xs sm:text-sm">
                      <div className="flex items-center space-x-1.5">
                        <Heart
                          className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : "fill-white text-white"}`}
                        />
                        <span>{likes}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <MessageCircle className="w-4 h-4 fill-white text-white" />
                        <span>{comments}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-200 font-semibold bg-white/10 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-xs truncate max-w-[90%]">
                      {post.location}
                    </span>
                  </div>

                  {/* Double Click Heart Animation */}
                  {showHeartAnim === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-300">
                      <Heart className="w-16 h-16 fill-rose-500 text-rose-500 drop-shadow-lg" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Call-To-Action Banner (Goizet Gestion Signature Design) */}
          <div className="bg-gradient-to-r from-calve-charcoal via-[#233134] to-calve-charcoal rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10 mt-8">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@{PROFILE.username}</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-light tracking-tight">
                {t.ctaFollow}
              </h4>
              <p className="text-xs text-white/70 font-light">
                {t.ctaConsult}
              </p>
            </div>
            <a
              href={PROFILE.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-calve-slate hover:bg-calve-slate-dark text-white px-8 py-3.5 rounded-full text-xs font-bold transition-all duration-300 shadow-xl flex items-center space-x-2.5 shrink-0 group cursor-pointer"
            >
              <span>{t.openInstagram}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* INSTAGRAM POST LIGHTBOX MODAL (DESKTOP IG DIALOGUE)        */}
      {/* ========================================================== */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top-Right Mobile */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-20 md:hidden w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Media Display */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative aspect-square md:aspect-auto select-none overflow-hidden">
              <img
                src={selectedPost.image}
                alt={selectedPost.caption[language]}
                className="w-full h-full object-contain"
                onDoubleClick={() => handleDoubleClick(selectedPost.id)}
              />
              {showHeartAnim === selectedPost.id && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-300">
                  <Heart className="w-20 h-20 fill-rose-500 text-rose-500 drop-shadow-xl" />
                </div>
              )}
            </div>

            {/* Right: Instagram Post Detail Panel */}
            <div className="md:w-2/5 flex flex-col justify-between bg-white text-calve-charcoal">
              {/* Header: Author + Location */}
              <div className="p-4 sm:p-5 border-b border-calve-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <img
                      src={PROFILE.avatarImage}
                      alt={PROFILE.username}
                      className="w-9 h-9 rounded-full object-cover border border-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-xs">
                      <span>{PROFILE.username}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                    </div>
                    <span className="text-[11px] text-calve-muted flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-calve-slate" />
                      <span>{selectedPost.location}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={PROFILE.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-calve-slate hover:text-calve-slate-dark"
                  >
                    {t.follow}
                  </a>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="hidden md:flex w-8 h-8 rounded-full hover:bg-calve-stone text-calve-muted hover:text-calve-charcoal items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Caption & Comments */}
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs leading-relaxed max-h-64 sm:max-h-80">
                <div className="space-y-2">
                  <p className="text-calve-charcoal">
                    <span className="font-bold mr-1.5">{PROFILE.username}</span>
                    {selectedPost.caption[language]}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPost.tags.map((tag, idx) => (
                      <span key={idx} className="text-calve-slate font-medium text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-calve-muted block pt-1 uppercase tracking-wider font-semibold">
                    {selectedPost.timeAgo[language]}
                  </span>
                </div>

                {/* Dynamically Added Comments */}
                {newComments[selectedPost.id] && newComments[selectedPost.id].length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-calve-border/60">
                    {newComments[selectedPost.id].map((comm, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-calve-charcoal">vous</span>
                        <span className="text-calve-charcoal/80">{comm}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar (Like, Comment, Share, Save) */}
              <div className="p-4 sm:p-5 border-t border-calve-border bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => handleToggleLike(selectedPost.id, e)}
                      className="cursor-pointer transition-transform active:scale-125"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          likedPosts[selectedPost.id]
                            ? "fill-rose-500 text-rose-500"
                            : "text-calve-charcoal hover:text-calve-slate"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => document.getElementById("post-comment-input")?.focus()}
                      className="cursor-pointer text-calve-charcoal hover:text-calve-slate transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(PROFILE.profileUrl);
                          alert(language === "fr" ? "Lien copié !" : "Link copied!");
                        }
                      }}
                      className="cursor-pointer text-calve-charcoal hover:text-calve-slate transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => handleToggleSave(selectedPost.id, e)}
                    className="cursor-pointer text-calve-charcoal hover:text-calve-slate transition-colors"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        savedPosts[selectedPost.id]
                          ? "fill-calve-charcoal text-calve-charcoal"
                          : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Likes Counter & Date */}
                <div className="text-xs">
                  <span className="font-extrabold text-calve-charcoal">
                    {likeCounts[selectedPost.id] ?? selectedPost.likes} J'aime
                  </span>
                </div>

                {/* Add Comment Form */}
                <form
                  onSubmit={(e) => handleAddComment(selectedPost.id, e)}
                  className="pt-2 flex items-center gap-2 border-t border-calve-border/60"
                >
                  <input
                    id="post-comment-input"
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={t.addCommentPlaceholder}
                    className="flex-1 text-xs bg-transparent focus:outline-none placeholder:text-calve-muted"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="text-xs font-bold text-calve-slate hover:text-calve-slate-dark disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {t.publish}
                  </button>
                </form>

                {/* View on Instagram Link */}
                <div className="pt-2 text-center">
                  <a
                    href={PROFILE.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-calve-muted hover:text-calve-charcoal inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{t.viewOriginal}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
