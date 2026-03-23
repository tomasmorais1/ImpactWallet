import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Sun, Moon, Globe, Languages, ChevronRight, Check, Palette, Info, Handshake
} from 'lucide-react';
import { useSettings, CURRENCIES, LANGUAGES, CurrencyCode, LanguageCode } from '../contexts/SettingsContext';
import { HelpCircle } from 'lucide-react';
export function AppSettings() {

  const { currency, setCurrencyCode, language, setLanguageCode, darkMode, toggleDarkMode, t } = useSettings();
  const [activePicker, setActivePicker] = useState<'currency' | 'language' | null>(null);
  const [showPartner, setShowPartner] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [bugName, setBugName] = useState('');
  const [bugEmail, setBugEmail] = useState('');
  const [bugMessage, setBugMessage] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerType, setPartnerType] = useState<'ngo' | 'company' | null>(null);
  const handlePartnerSubmit = () => {
    if (!partnerName || !partnerEmail) {
      alert("Please fill all fields");
      return;
    }

    alert(`Request sent!\nCompany: ${partnerName}\nEmail: ${partnerEmail}`);

    setPartnerName('');
    setPartnerEmail('');
  };
const handleBugSubmit = () => {
  if (!bugName || !bugEmail || !bugMessage) {
    alert('Please fill all fields');
    return;
  }

  alert('Bug report sent successfully! 🐛');

  setBugName('');
  setBugEmail('');
  setBugMessage('');
};
  return (
    <div className="space-y-4">

      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 border-0 text-white overflow-hidden">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-white">{t.settingsTitle}</h2>
              <p className="text-purple-100 text-sm">{t.settingsDesc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">{t.appearance}</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-transparent bg-secondary/50 hover:bg-secondary transition-all"
          >
            <div className="flex items-center gap-3">

              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-100' : 'bg-amber-100'}`}>
                {darkMode
                  ? <Moon className="h-5 w-5 text-indigo-600" />
                  : <Sun className="h-5 w-5 text-amber-500" />
                }
              </div>

              <div className="text-left">
                <p className="text-sm font-medium">{darkMode ? t.darkMode : t.lightMode}</p>
                <p className="text-xs text-muted-foreground">
                  {darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                </p>
              </div>

            </div>

            <div className={`relative inline-flex h-7 w-12 items-center rounded-full ${darkMode ? 'bg-emerald-600' : 'bg-gray-200'}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>

          </button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-base">{t.preferences}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">

          {/* Currency */}
          <button
            onClick={() => setActivePicker(activePicker === 'currency' ? null : 'currency')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary"
          >

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-bold text-sm">{currency.symbol}</span>
              </div>

              <div className="text-left">
                <p className="text-sm font-medium">{t.currency}</p>
                <p className="text-xs text-muted-foreground">{currency.name} ({currency.code})</p>
              </div>

            </div>

            <ChevronRight className={`h-4 w-4 ${activePicker === 'currency' ? 'rotate-90' : ''}`} />

          </button>

          {activePicker === 'currency' && (
            <div className="rounded-xl border overflow-hidden">

              {CURRENCIES.map((c, i) => (
                <button
                  key={c.code}
                  onClick={() => { setCurrencyCode(c.code as CurrencyCode); setActivePicker(null); }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-secondary ${i !== 0 ? 'border-t' : ''}`}
                >

                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-bold text-sm">{c.symbol}</span>
                    <p className="text-sm">{c.name}</p>
                  </div>

                  {currency.code === c.code && (
                    <Check className="h-4 w-4 text-purple-600" />
                  )}

                </button>
              ))}

            </div>
          )}

          {/* Language */}
          <button
            onClick={() => setActivePicker(activePicker === 'language' ? null : 'language')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary"
          >

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Languages className="h-5 w-5 text-blue-600" />
              </div>

              <div className="text-left">
                <p className="text-sm font-medium">{t.language}</p>
                <p className="text-xs text-muted-foreground">{language.flag} {language.name}</p>
              </div>

            </div>

            <ChevronRight className={`h-4 w-4 ${activePicker === 'language' ? 'rotate-90' : ''}`} />

          </button>

          {activePicker === 'language' && (
            <div className="rounded-xl border overflow-hidden">

              {LANGUAGES.map((l, i) => (
                <button
                  key={l.code}
                  onClick={() => { setLanguageCode(l.code as LanguageCode); setActivePicker(null); }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-secondary ${i !== 0 ? 'border-t' : ''}`}
                >

                  <div className="flex items-center gap-3">
                    <span className="text-xl">{l.flag}</span>
                    <p className="text-sm">{l.name}</p>
                  </div>

                  {language.code === l.code && (
                    <Check className="h-4 w-4 text-purple-600" />
                  )}

                </button>
              ))}

            </div>
          )}

        </CardContent>
      </Card>

      {/* Partner Section */}
<Card>
  <CardHeader className="pb-3">
    <div className="flex items-center gap-2">
      <Handshake className="h-4 w-4 text-emerald-600" />
      <CardTitle className="text-base">Be a Partner</CardTitle>
    </div>
  </CardHeader>

  <CardContent className="space-y-3">

    <button
      onClick={() => {
        setShowPartner(!showPartner);
        setPartnerType(null);
      }}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary"
    >
      <span className="text-sm font-medium">Partner with Impact Wallet</span>
      <ChevronRight className={`h-4 w-4 ${showPartner ? 'rotate-90' : ''}`} />
    </button>

    {showPartner && (
      <div className="p-4 rounded-xl bg-secondary/40 space-y-4">

        {/* STEP 1 - Select type */}
        {!partnerType && (
          <div className="space-y-2">

            <p className="text-sm font-medium">Select partnership type</p>

            <div className="grid grid-cols-2 gap-2">

              <button
                onClick={() => setPartnerType('ngo')}
                className="p-3 rounded-lg border hover:bg-emerald-50 text-sm"
              >
                NGO 🌱
              </button>

              <button
                onClick={() => setPartnerType('company')}
                className="p-3 rounded-lg border hover:bg-blue-50 text-sm"
              >
                Company 💼
              </button>

            </div>

          </div>
        )}

        {/* STEP 2 - Form */}
        {partnerType && (
          <div className="space-y-3">

            <div>
              <label className="text-xs text-muted-foreground">
                {partnerType === 'ngo' ? 'NGO Name' : 'Company Name'}
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Enter name"
                className="w-full mt-1 p-2 rounded-lg border text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full mt-1 p-2 rounded-lg border text-sm"
              />
            </div>

            <button
              onClick={() => {
                if (!partnerName || !partnerEmail) {
                  alert("Please fill all fields");
                  return;
                }

                alert(`Request sent as ${partnerType}\nName: ${partnerName}`);

                setPartnerName('');
                setPartnerEmail('');
                setPartnerType(null);
                setShowPartner(false);
              }}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
            >
              Send Request
            </button>

            <button
              onClick={() => setPartnerType(null)}
              className="w-full text-xs text-muted-foreground"
            >
              ← Change type
            </button>

          </div>
        )}

      </div>
    )}

  </CardContent>
</Card>
{/* Help & Support */}
<Card>
  <CardHeader className="pb-3">
    <div className="flex items-center gap-2">
      <HelpCircle className="h-4 w-4 text-indigo-600" />
      <CardTitle className="text-base">Help & Support</CardTitle>
    </div>
  </CardHeader>

  <CardContent className="space-y-3">

    {/* Toggle */}
    <button
      onClick={() => setShowHelp(!showHelp)}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary"
    >
      <span className="text-sm font-medium">How it works</span>
      <ChevronRight className={`h-4 w-4 ${showHelp ? 'rotate-90' : ''}`} />
    </button>

    {/* Expanded Content */}
    {showHelp && (
      <div className="p-4 rounded-xl bg-secondary/40 space-y-5 text-sm">

        {/* Donations */}
        <div className="space-y-1">
          <p className="font-semibold text-base">💸 Donations</p>
          <p className="text-muted-foreground text-xs">
            Save money → earn points → convert into donations.
            You control how much of your savings goes to NGOs.
          </p>
        </div>

        {/* Partnerships */}
        <div className="space-y-1">
          <p className="font-semibold text-base">🤝 Partnerships</p>
          <p className="text-muted-foreground text-xs">
            Businesses and NGOs can join Impact Wallet
            to create campaigns, rewards and real-world impact.
          </p>
        </div>

        {/* BUG FORM */}
        <div className="pt-4 border-t space-y-3">

          <p className="font-semibold text-base">🐛 Report a Bug</p>

          {/* Name */}
          <input
            type="text"
            value={bugName}
            onChange={(e) => setBugName(e.target.value)}
            placeholder="Your name"
            className="w-full p-2 rounded-lg border text-sm"
          />

          {/* Email */}
          <input
            type="email"
            value={bugEmail}
            onChange={(e) => setBugEmail(e.target.value)}
            placeholder="Your email"
            className="w-full p-2 rounded-lg border text-sm"
          />

          {/* Message */}
          <textarea
            value={bugMessage}
            onChange={(e) => setBugMessage(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full p-2 rounded-lg border text-sm min-h-[80px]"
          />

          {/* Submit */}
          <button
            onClick={handleBugSubmit}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Send Report
          </button>

        </div>

      </div>
    )}

  </CardContent>
</Card>
      {/* About */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Impact Wallet v1.0</p>
              <p className="text-xs text-muted-foreground">
                Earn Impact Points by saving and redeem them for rewards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}