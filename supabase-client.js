// =====================================================
// supabase-client.js - العميل المشترك
// =====================================================

const SUPABASE_URL = 'https://sdhzsmqmzhrkmqvlfkbw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TkKnKCzURmMPo_a9AC4onw_7Stal8F5';

// تحميل مكتبة Supabase
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase Ready');
        window.dispatchEvent(new Event('supabase-ready'));
    };
    script.onerror = () => console.error('❌ فشل تحميل مكتبة Supabase');
    document.head.appendChild(script);
})();

// =====================================================
// دوال API
// =====================================================
window.SB = {
    // ---------- المقالات ----------
    async getArticles() {
        const { data, error } = await supabaseClient.from('articles').select('*')
            .eq('published', true).order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },
    async getAllArticles() {
        const { data, error } = await supabaseClient.from('articles').select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },
    async createArticle(article) {
        const { data, error } = await supabaseClient.from('articles').insert([article]).select().single();
        if (error) throw error;
        return data;
    },
    async updateArticle(id, updates) {
        const { data, error } = await supabaseClient.from('articles').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    async deleteArticle(id) {
        const { error } = await supabaseClient.from('articles').delete().eq('id', id);
        if (error) throw error;
    },

    // ---------- المشاريع ----------
    async getProjects() {
        const { data, error } = await supabaseClient.from('projects').select('*')
            .eq('published', true).order('display_order', { ascending: true });
        if (error) throw error;
        return data || [];
    },
    async getAllProjects() {
        const { data, error } = await supabaseClient.from('projects').select('*')
            .order('display_order', { ascending: true });
        if (error) throw error;
        return data || [];
    },
    async createProject(project) {
        const { data, error } = await supabaseClient.from('projects').insert([project]).select().single();
        if (error) throw error;
        return data;
    },
    async updateProject(id, updates) {
        const { data, error } = await supabaseClient.from('projects').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    async deleteProject(id) {
        const { error } = await supabaseClient.from('projects').delete().eq('id', id);
        if (error) throw error;
    },

    // ---------- الرسائل ----------
    async sendMessage(message) {
        const { data, error } = await supabaseClient.from('messages').insert([message]).select().single();
        if (error) throw error;
        return data;
    },
    async getMessages() {
        const { data, error } = await supabaseClient.from('messages').select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },
    async updateMessage(id, updates) {
        const { data, error } = await supabaseClient.from('messages').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    async deleteMessage(id) {
        const { error } = await supabaseClient.from('messages').delete().eq('id', id);
        if (error) throw error;
    },
    async deleteAllMessages() {
        const { error } = await supabaseClient.from('messages').delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
    },

    // ---------- المفضلة ----------
    async getBookmarks(visitorId) {
        const { data, error } = await supabaseClient.from('bookmarks').select('article_id')
            .eq('visitor_id', visitorId);
        if (error) throw error;
        return (data || []).map(b => b.article_id);
    },
    async toggleBookmark(visitorId, articleId) {
        const { data: existing } = await supabaseClient.from('bookmarks').select('id')
            .eq('visitor_id', visitorId).eq('article_id', articleId).maybeSingle();
        if (existing) {
            const { error } = await supabaseClient.from('bookmarks').delete().eq('id', existing.id);
            if (error) throw error;
            return false;
        } else {
            const { error } = await supabaseClient.from('bookmarks')
                .insert([{ visitor_id: visitorId, article_id: articleId }]);
            if (error) throw error;
            return true;
        }
    },

    // ---------- المشاهدات ----------
    async incrementView(articleId, visitorId) {
        const { error } = await supabaseClient.rpc('increment_article_views', {
            article_uuid: articleId, visitor: visitorId
        });
        if (error) console.error('View error:', error);
    },

    // ---------- الإعدادات ----------
    async getSettings(key) {
        const { data, error } = await supabaseClient.from('site_settings').select('value')
            .eq('key', key).maybeSingle();
        if (error) throw error;
        return data?.value;
    },
    async updateSettings(key, value) {
        const { data, error } = await supabaseClient.from('site_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        return data;
    },

    // ---------- المصادقة ----------
    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },
    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    },
    async getSession() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        return session;
    },
    onAuthChange(callback) {
        supabaseClient.auth.onAuthStateChange((event, session) => callback(event, session));
    }
};

// =====================================================
// معرّف الزائر
// =====================================================
window.getVisitorId = function() {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
};