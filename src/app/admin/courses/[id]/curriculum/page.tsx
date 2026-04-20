"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api-config";
import { 
    Plus, 
    Trash2, 
    Edit, 
    ChevronDown, 
    ChevronUp, 
    GripVertical, 
    Video, 
    FileText, 
    File as FileIcon, 
    HelpCircle,
    Save,
    ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/admin";

interface Chapter {
    _id: string;
    title: string;
    order: number;
    courseId: string;
}

interface Lesson {
    _id: string;
    chapterId: string;
    courseId: string;
    title: string;
    lessonType: 'video' | 'text' | 'document' | 'quiz';
    order: number;
    isFree: boolean;
}

export default function CurriculumPage() {
    const { id: courseId } = useParams();
    const router = useRouter();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
    const [loading, setLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'chapter' | 'lesson'>('chapter');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: "",
        lessonType: 'video' as any,
        isFree: false
    });

    const fetchCurriculum = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        try {
            // Fetch Course Title
            const courseRes = await fetch(`${API_BASE}/courses/${courseId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const courseData = await courseRes.json();
            if (courseData.success) setCourseTitle(courseData.data.title);

            // Fetch Chapters
            const chapterRes = await fetch(`${API_BASE}/chapters?courseId=${courseId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const chapterData = await chapterRes.json();
            if (chapterData.success) {
                const fetchedChapters = chapterData.data;
                setChapters(fetchedChapters);

                // Fetch Lessons for each chapter
                const lessonMap: Record<string, Lesson[]> = {};
                for (const chap of fetchedChapters) {
                    const lessonRes = await fetch(`${API_BASE}/lessons?chapterId=${chap._id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const lData = await lessonRes.json();
                    if (lData.success) lessonMap[chap._id] = lData.data;
                }
                setLessons(lessonMap);
            }
        } catch (error) {
            console.error("Failed to fetch curriculum", error);
        }
        setLoading(false);
    }, [courseId]);

    useEffect(() => {
        fetchCurriculum();
    }, [fetchCurriculum]);

    const handleSaveChapter = async () => {
        const token = localStorage.getItem("adminToken");
        const url = editingItem ? `${API_BASE}/chapters/${editingItem._id}` : `${API_BASE}/chapters`;
        const method = editingItem ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                title: form.title, 
                courseId,
                order: chapters.length + 1
            })
        });
        setModalOpen(false);
        fetchCurriculum();
    };

    const handleSaveLesson = async () => {
        const token = localStorage.getItem("adminToken");
        const url = editingItem ? `${API_BASE}/lessons/${editingItem._id}` : `${API_BASE}/lessons`;
        const method = editingItem ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                ...form,
                courseId,
                chapterId: activeChapterId,
                order: (lessons[activeChapterId!]?.length || 0) + 1
            })
        });
        setModalOpen(false);
        fetchCurriculum();
    };

    const handleDeleteChapter = async (id: string) => {
        if (!confirm("Delete chapter and all its lessons?")) return;
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/chapters/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchCurriculum();
    };

    const handleDeleteLesson = async (id: string) => {
        if (!confirm("Delete lesson?")) return;
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/lessons/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchCurriculum();
    };

    if (loading) return <div className="p-20 text-center text-white/40 uppercase tracking-widest font-bold">Loading Curriculum...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <header className="flex items-center gap-6 mb-10">
                <button onClick={() => router.back()} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                    <ArrowLeft size={20} className="text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Curriculum <span className="text-[#00875a]">Builder</span>
                    </h1>
                    <p className="text-white/40 text-sm uppercase tracking-widest font-medium">{courseTitle}</p>
                </div>
                <button 
                    onClick={() => { setModalType('chapter'); setEditingItem(null); setForm({title: "", lessonType: 'video', isFree: false}); setModalOpen(true); }}
                    className="ml-auto bg-[#00875a] text-black font-black px-6 py-3 rounded-xl flex items-center gap-2 uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                >
                    <Plus size={18} /> Add Chapter
                </button>
            </header>

            <div className="space-y-6">
                {chapters.map((chapter) => (
                    <div key={chapter._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-4 flex items-center gap-4 border-bottom border-white/5 bg-white/[0.02]">
                            <div className="w-8 h-8 rounded-lg bg-[#00875a]/10 flex items-center justify-center text-[#00875a] font-bold">
                                {chapter.order}
                            </div>
                            <h3 className="flex-1 text-lg font-bold text-white uppercase tracking-tight">{chapter.title}</h3>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => { setActiveChapterId(chapter._id); setModalType('lesson'); setEditingItem(null); setForm({title: "", lessonType: 'video', isFree: false}); setModalOpen(true); }}
                                    className="p-2 text-white/40 hover:text-[#00875a] transition-colors"
                                    title="Add Lesson"
                                >
                                    <Plus size={20} />
                                </button>
                                <button 
                                    onClick={() => { setModalType('chapter'); setEditingItem(chapter); setForm({title: chapter.title, lessonType: 'video', isFree: false}); setModalOpen(true); }}
                                    className="p-2 text-white/40 hover:text-white transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDeleteChapter(chapter._id)} className="p-2 text-white/40 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-2">
                            {lessons[chapter._id]?.length ? (
                                lessons[chapter._id].map((lesson) => (
                                    <div key={lesson._id} className="group flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-[#00875a]/30 transition-all">
                                        <div className="text-white/20">
                                            {lesson.lessonType === 'video' && <Video size={18} />}
                                            {lesson.lessonType === 'text' && <FileText size={18} />}
                                            {lesson.lessonType === 'document' && <FileIcon size={18} />}
                                            {lesson.lessonType === 'quiz' && <HelpCircle size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white/80 uppercase tracking-wide">{lesson.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{lesson.lessonType}</span>
                                                {lesson.isFree && <span className="text-[9px] bg-[#00875a]/20 text-[#00875a] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Free</span>}
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all">
                                            <button 
                                                onClick={() => { setActiveChapterId(chapter._id); setModalType('lesson'); setEditingItem(lesson); setForm({title: lesson.title, lessonType: lesson.lessonType, isFree: lesson.isFree}); setModalOpen(true); }}
                                                className="p-1.5 text-white/40 hover:text-white"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteLesson(lesson._id)} className="p-1.5 text-white/40 hover:text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                                    <p className="text-xs font-bold text-white/10 uppercase tracking-[0.2em]">No lessons yet in this chapter</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-8"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">
                                {editingItem ? 'Edit' : 'Add'} <span className="text-[#00875a]">{modalType}</span>
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block mb-2">Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00875a] outline-none transition-all"
                                        value={form.title}
                                        onChange={(e: any) => setForm({...form, title: e.target.value})}
                                        placeholder={`Enter ${modalType} title...`}
                                    />
                                </div>

                                {modalType === 'lesson' && (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block mb-2">Lesson Type</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['video', 'text', 'document', 'quiz'].map(t => (
                                                    <button 
                                                        key={t}
                                                        onClick={() => setForm({...form, lessonType: t as any})}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${form.lessonType === t ? 'bg-[#00875a] text-black border-[#00875a]' : 'bg-white/5 text-white/40 border-white/10'}`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                id="isFree"
                                                checked={form.isFree}
                                                onChange={(e: any) => setForm({...form, isFree: e.target.checked})}
                                                className="w-5 h-5 accent-[#00875a]"
                                            />
                                            <label htmlFor="isFree" className="text-xs font-black uppercase tracking-widest text-white/60 cursor-pointer">Preview Lesson (Free)</label>
                                        </div>
                                    </>
                                )}

                                <button 
                                    onClick={modalType === 'chapter' ? handleSaveChapter : handleSaveLesson}
                                    className="w-full bg-[#00875a] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <Save size={18} /> Save {modalType}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
