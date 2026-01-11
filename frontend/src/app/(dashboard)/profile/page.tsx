"use client"

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Camera, Lock, Globe, Bell, Phone, Calendar, Users, Trophy, Medal, Plus, Shield } from "lucide-react"
import { useLanguageStore, translations } from "@/store/use-language-store"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useTheme } from "next-themes"

export default function ProfilePage() {
  const { language, setLanguage } = useLanguageStore()
  const { theme, setTheme } = useTheme()
  const t = translations[language].dashboard.profile
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80")

  // Mock states for form fields
  const [twoFactor, setTwoFactor] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [marketingNotif, setMarketingNotif] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Settings updated successfully", {
        description: "Your changes have been saved to our secure vault."
      })
    }, 1500)
  }

  if (!mounted) return null

  const Toggle = ({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (c: boolean) => void }) => (
    <div 
      onClick={() => onCheckedChange(!checked)}
      className={`w-14 h-8 shrink-0 rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  )

  const TabButton = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <Button 
      variant="ghost" 
      onClick={() => setActiveTab(id)}
      className={`w-full justify-start rounded-2xl h-12 gap-3 font-bold transition-all duration-300 ${
        activeTab === id 
          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 shadow-sm ring-1 ring-emerald-500/20" 
          : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      <Icon className={`w-5 h-5 ${activeTab === id ? "text-emerald-600" : "text-slate-400"}`} /> 
      {label}
    </Button>
  )

  return (
    <div className="space-y-10 pb-10 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 
          className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
          dangerouslySetInnerHTML={{ __html: t.title }}
        />
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 transition-colors duration-300">
          {t.subtitle}
        </p>
      </div>

      {/* Mobile Navigation Dropdown (Visible only on lg and down) */}
      <div className="lg:hidden mb-8">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-border shadow-sm text-slate-900 dark:text-white font-bold px-4 transition-all active:scale-[0.99]">
             <div className="flex items-center gap-3">
                {activeTab === 'personal' && <User className="w-5 h-5 text-emerald-600" />}
                {activeTab === 'security' && <Lock className="w-5 h-5 text-emerald-600" />}
                {activeTab === 'achievements' && <Trophy className="w-5 h-5 text-emerald-600" />}
                {activeTab === 'family' && <Users className="w-5 h-5 text-emerald-600" />}
                {activeTab === 'notifications' && <Bell className="w-5 h-5 text-emerald-600" />}
                {activeTab === 'display' && <Globe className="w-5 h-5 text-emerald-600" />}
                <span className="capitalize">{
                  activeTab === 'personal' ? t.personalInfo :
                  activeTab === 'security' ? (t.security?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Security") :
                  activeTab === 'achievements' ? (t.achievements?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Achievements") :
                  activeTab === 'family' ? (t.family?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Family") :
                  activeTab === 'notifications' ? (t.notifications?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Notifications") :
                  (t.display?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Display")
                }</span>
             </div>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border shadow-xl bg-white dark:bg-slate-900 overflow-hidden p-1 max-h-[40vh] overflow-y-auto">
             {[
               { id: "personal", icon: User, label: t.personalInfo },
               { id: "security", icon: Lock, label: t.security?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Security" },
               { id: "achievements", icon: Trophy, label: t.achievements?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Achievements" },
               { id: "family", icon: Users, label: t.family?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Family" },
               { id: "notifications", icon: Bell, label: t.notifications?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Notifications" },
               { id: "display", icon: Globe, label: t.display?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Display" },
             ].map((item) => (
                <SelectItem key={item.id} value={item.id} className="rounded-xl my-1 py-3 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-emerald-600 font-bold text-slate-500 dark:text-slate-400">
                   <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                   </div>
                </SelectItem>
             ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar settings navigation - Hidden on Mobile */}
        <div className="hidden lg:block space-y-4">
          <Card className="border-border bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
            <CardContent className="p-4 space-y-1">
              <TabButton id="personal" icon={User} label={t.personalInfo} />
              <TabButton id="security" icon={Lock} label={t.security?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Security"} />
              <TabButton id="achievements" icon={Trophy} label={t.achievements?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Achievements"} />
              <TabButton id="family" icon={Users} label={t.family?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Family"} />
              <TabButton id="notifications" icon={Bell} label={t.notifications?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Notifications"} />
              <TabButton id="display" icon={Globe} label={t.display?.title.replace(/<\/?[^>]+(>|$)/g, "") || "Display"} />
            </CardContent>
          </Card>
        </div>

        {/* Main form area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-300">
            <CardHeader className="p-6 md:p-8 border-b border-border bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 transition-transform duration-500 group-hover:scale-105 shadow-md">
                    <img 
                      src={avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="avatar-upload" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 hover:shadow-sm active:scale-95 cursor-pointer z-10"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                </div>
                <div className="text-center md:text-left space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">User Petrus</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs transition-colors duration-300">Verified Account • Basic Plan</p>
                  <label htmlFor="avatar-upload">
                    <Button asChild variant="outline" size="sm" className="mt-4 rounded-full border-border font-bold transition-all duration-300 hover:shadow-sm cursor-pointer">
                      <span>{t.changeAvatar}</span>
                    </Button>
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors duration-300">{t.fullName}</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 transition-colors duration-300" />
                      <Input className="h-12 pl-12 rounded-2xl border-border bg-slate-50/30 font-medium focus:ring-emerald-500 transition-all duration-300" placeholder="Petrus Handika" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors duration-300">{t.displayName}</Label>
                    <Input className="h-12 rounded-2xl border-border bg-slate-50/30 font-medium focus:ring-emerald-500 transition-all duration-300" placeholder="Petrus" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors duration-300">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 transition-colors duration-300" />
                      <Input className="h-12 pl-12 rounded-2xl border-border bg-slate-50/30 font-medium cursor-not-allowed opacity-70 transition-all duration-300" value="petrus@homesweetloan.com" readOnly />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold ml-1 italic transition-colors duration-300">* {language === 'id' ? "Email tidak dapat diubah demi keamanan." : "Email cannot be changed for security reasons."}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors duration-300 flex items-center justify-between">
                      {t.phoneNumber}
                      <span className="text-[10px] text-slate-400 font-normal italic">{t.optional}</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 transition-colors duration-300" />
                      <Input className="h-12 pl-12 rounded-2xl border-border bg-slate-50/30 font-medium focus:ring-emerald-500 transition-all duration-300" placeholder="+62 812..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors duration-300 flex items-center justify-between">
                      {t.birthDate}
                      <span className="text-[10px] text-slate-400 font-normal italic">{t.optional}</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 transition-colors duration-300" />
                      <Input type="date" className="h-12 pl-12 rounded-2xl border-border bg-slate-50/30 font-medium focus:ring-emerald-500 transition-all duration-300" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors duration-300 flex items-center justify-between">
                      {t.gender}
                      <span className="text-[10px] text-slate-400 font-normal italic">{t.optional}</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-2xl border-border bg-slate-50/30 font-medium focus:ring-emerald-500 transition-all duration-300">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-slate-400" />
                          <SelectValue placeholder={language === 'id' ? "Pilih Gender" : "Select Gender"} />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border animate-in fade-in zoom-in-95 duration-200">
                        <SelectItem value="male" className="cursor-pointer">{t.genderMale}</SelectItem>
                        <SelectItem value="female" className="cursor-pointer">{t.genderFemale}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white pb-2 border-b border-border">{t.security?.title.replace(/<\/?[^>]+(>|$)/g, "")}</h3>
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1">{t.security?.currentPwd}</Label>
                          <Input type="password" className="h-12 rounded-2xl border-border bg-slate-50/30 font-medium focus:ring-emerald-500" placeholder="••••••••" />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1">{t.security?.newPwd}</Label>
                          <Input type="password" className="h-12 rounded-2xl border-border bg-slate-50/30 font-medium focus:ring-emerald-500" placeholder="••••••••" />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1">{t.security?.confirmPwd}</Label>
                          <Input type="password" className="h-12 rounded-2xl border-border bg-slate-50/30 font-medium focus:ring-emerald-500" placeholder="••••••••" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white pb-2 border-b border-border">{t.security?.twoFactor}</h3>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="font-black text-emerald-900 dark:text-emerald-400">{t.security?.twoFactor}</h4>
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-500 pr-4">{t.security?.twoFactorDesc}</p>
                              </div>
                              <Toggle checked={twoFactor} onCheckedChange={setTwoFactor} />
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white pb-2 border-b border-border">{t.notifications?.title.replace(/<\/?[^>]+(>|$)/g, "")}</h3>
                  <div className="space-y-4">
                     {[
                       { id: "email", label: t.notifications?.email, desc: t.notifications?.emailDesc, state: emailNotif, set: setEmailNotif },
                       { id: "push", label: t.notifications?.push, desc: t.notifications?.pushDesc, state: pushNotif, set: setPushNotif },
                       { id: "marketing", label: t.notifications?.marketing, desc: t.notifications?.marketingDesc, state: marketingNotif, set: setMarketingNotif },
                     ].map(item => (
                       <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-slate-50/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="space-y-1">
                             <h4 className="font-bold text-slate-900 dark:text-white">{item.label}</h4>
                             <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                          </div>
                          <Toggle checked={item.state} onCheckedChange={item.set} />
                       </div>
                     ))}
                  </div>
                </div>
              )}

               {/* Display Tab */}
               {activeTab === "display" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white pb-2 border-b border-border">{t.display?.title.replace(/<\/?[^>]+(>|$)/g, "")}</h3>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Theme Selector */}
                    <div className="space-y-4">
                      <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1 text-base">{t.display?.theme}</Label>
                      <p className="text-sm text-slate-500 font-medium mb-4">{t.display?.themeDesc}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['light', 'dark'].map((mode) => (
                           <button 
                             key={mode}
                             onClick={() => setTheme(mode)}
                             className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${theme === mode ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-border hover:border-emerald-300'}`}
                           >
                             <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center ${mode === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                               {mode === 'light' && <div className="w-4 h-4 rounded-full bg-amber-400" />}
                               {mode === 'dark' && <div className="w-4 h-4 rounded-full bg-slate-400" />}
                             </div>
                             <span className="font-bold text-xs capitalize text-slate-700 dark:text-slate-300">{mode}</span>
                           </button>
                        ))}
                      </div>
                    </div>

                    {/* Language Selector */}
                    <div className="space-y-4">
                      <Label className="font-bold text-slate-700 dark:text-slate-300 ml-1 text-base">{t.display?.language}</Label>
                      <p className="text-sm text-slate-500 font-medium mb-4">{t.display?.languageDesc}</p>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { code: 'id', label: 'Indonesia', flag: 'https://flagcdn.com/w40/id.png' },
                          { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/us.png' }
                        ].map((lang) => (
                           <button 
                             key={lang.code}
                             onClick={() => setLanguage(lang.code as any)}
                             className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${language === lang.code ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-border hover:border-emerald-300'}`}
                           >
                              <img src={lang.flag} alt={lang.label} className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100" />
                              <span className="font-black text-slate-800 dark:text-white">{lang.label}</span>
                           </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements Tab (Gen Z / Millennial Feature) */}
              {activeTab === "achievements" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white" dangerouslySetInnerHTML={{ __html: t.achievements?.title || "Achievements" }} />
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Top 10% User</span>
                    </div>
                  </div>

                  {/* Level & XP Card */}
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-between mb-6">
                      <div>
                        <p className="text-emerald-100 font-bold text-xs uppercase tracking-wider mb-1">{t.achievements?.level}</p>
                        <h2 className="text-3xl font-black">Financial Guru <span className="text-2xl">ign</span></h2>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                         <span className="text-2xl font-black">42</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                      <div className="flex justify-between text-xs font-bold text-emerald-50">
                        <span>2,450 {t.achievements?.points}</span>
                        <span>3,000 XP</span>
                      </div>
                      <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="h-full bg-gradient-to-r from-yellow-300 to-amber-500 w-[82%] relative">
                           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-emerald-100 font-medium text-right mt-1">550 XP to Level 43</p>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                      <Medal className="w-5 h-5 text-emerald-500" />
                      {t.achievements?.badges}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { title: "Saver Starter", icon: "🐷", color: "bg-pink-100 text-pink-600 border-pink-200", unlocked: true },
                        { title: "Debt Destroyer", icon: "⚔️", color: "bg-red-100 text-red-600 border-red-200", unlocked: true },
                        { title: "Asset King", icon: "👑", color: "bg-amber-100 text-amber-600 border-amber-200", unlocked: true },
                        { title: "Budget Master", icon: "🎯", color: "bg-blue-100 text-blue-600 border-blue-200", unlocked: true },
                        { title: "Invincible", icon: "🛡️", color: "bg-slate-100 text-slate-400 border-slate-200", unlocked: false },
                        { title: "Philanthropist", icon: "❤️", color: "bg-slate-100 text-slate-400 border-slate-200", unlocked: false },
                        { title: "Crypto Whale", icon: "🐋", color: "bg-slate-100 text-slate-400 border-slate-200", unlocked: false },
                        { title: "Century Club", icon: "💯", color: "bg-slate-100 text-slate-400 border-slate-200", unlocked: false },
                      ].map((badge, idx) => (
                         <div key={idx} className={`p-4 rounded-2xl border flex flex-col items-center gap-3 text-center transition-all duration-300 ${badge.unlocked ? `${badge.color} border-current` : 'bg-slate-50 dark:bg-slate-800 border-border opacity-60'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-white dark:bg-slate-900 shadow-sm ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
                               {badge.icon}
                            </div>
                            <div>
                               <p className={`font-bold text-xs ${badge.unlocked ? '' : 'text-slate-500'}`}>{badge.title}</p>
                               {!badge.unlocked && <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{t.achievements?.locked}</p>}
                            </div>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Family Management Tab (Sandwich Generation Feature) */}
              {activeTab === "family" && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                       <h3 className="text-lg font-black text-slate-800 dark:text-white" dangerouslySetInnerHTML={{ __html: t.family?.title || "Family Management" }} />
                       <Button size="sm" className="rounded-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                          <Plus className="w-4 h-4" /> {t.family?.addMember}
                       </Button>
                    </div>

                    <div className="space-y-2">
                       <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.family?.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       {[
                          { name: "Petrus Handika", role: "Family Head", relation: "You", avatar: avatar, limit: "Rp ∞" },
                          { name: "Sarah Handika", role: "Spouse", relation: "Wife", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", limit: "Rp 15.000.000" },
                          { name: "Budi Santoso", role: "Dependent (Parent)", relation: "Father", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80", limit: "Rp 5.000.000" },
                          { name: "Kenzo Handika", role: "Dependent (Child)", relation: "Son", avatar: "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=100&h=100&q=80", limit: "Rp 2.500.000" },
                       ].map((member, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-3xl border border-border shadow-sm hover:border-emerald-500/30 transition-all duration-300 group gap-4">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0">
                                   <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                   <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate text-sm sm:text-base">
                                      {member.name}
                                      {idx === 0 && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-emerald-200 shrink-0">Owner</span>}
                                   </h4>
                                   <p className="text-xs text-slate-500 font-medium truncate">{member.relation} • {member.role}</p>
                                </div>
                             </div>
                             <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 dark:border-slate-700 pt-3 sm:pt-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.family?.limit}</span>
                                <span className="font-black text-slate-700 dark:text-slate-300">{member.limit}</span>
                             </div>
                          </div>
                       ))}
                    </div>

                    <div className="bg-blue-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-blue-100 dark:border-indigo-900/30 flex gap-4 items-start">
                       <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-indigo-400">
                          <Shield className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="font-bold text-blue-900 dark:text-indigo-300 text-sm mb-1">Multi-Generational SafeGuard</h4>
                          <p className="text-xs text-blue-700 dark:text-indigo-400 leading-relaxed font-medium">
                             Create dedicated financial buffers for your elderly parents and children. Ensure your personal retirement savings remain untouched while caring for your loved ones.
                          </p>
                       </div>
                    </div>
                 </div>
              )}

              <div className="pt-8 border-t border-border flex justify-end gap-4">
                <Button variant="ghost" className="rounded-2xl h-12 px-8 font-black text-slate-500 transition-all duration-300">{t.cancelBtn}</Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-full h-12 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black active:scale-95 transition-all duration-300 hover:shadow-sm min-w-40"
                >
                  {isSaving ? "Saving..." : t.saveBtn}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

