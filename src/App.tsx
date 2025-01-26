import { useState, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import {
  Box,
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Grid,
  Tooltip,
  IconButton,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Download,
  ContentCopy,
  Language as LanguageIcon,
  Api as ApiIcon,
  RestartAlt,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { toPng, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

// Language translations
const translations = {
  en: {
    title: 'QR Code Generator Pro',
    inputLabel: 'Enter text or URL',
    chooseStyle: 'Choose a Style',
    format: {
      label: 'QR Code Format',
      canvas: 'Canvas (Better for small sizes)',
      svg: 'SVG (Better for large sizes)',
    },
    size: 'Size (px)',
    errorLevel: {
      label: 'Error Correction Level',
      low: 'Low (7%)',
      medium: 'Medium (15%)',
      quartile: 'Quartile (25%)',
      high: 'High (30%)',
    },
    colors: {
      label: 'Custom Colors',
      foreground: 'Foreground Color',
      background: 'Background Color',
    },
    logo: {
      label: 'Logo (Optional)',
      upload: 'Upload Logo',
    },
    export: {
      copyTooltip: 'Copy to Clipboard',
    },
  },
  es: {
    title: 'Generador de Código QR Pro',
    inputLabel: 'Ingrese texto o URL',
    chooseStyle: 'Elegir Estilo',
    format: {
      label: 'Formato de Código QR',
      canvas: 'Canvas (Mejor para tamaños pequeños)',
      svg: 'SVG (Mejor para tamaños grandes)',
    },
    size: 'Tamaño (px)',
    errorLevel: {
      label: 'Nivel de Corrección de Error',
      low: 'Bajo (7%)',
      medium: 'Medio (15%)',
      quartile: 'Cuartil (25%)',
      high: 'Alto (30%)',
    },
    colors: {
      label: 'Colores Personalizados',
      foreground: 'Color del Frente',
      background: 'Color del Fondo',
    },
    logo: {
      label: 'Logo (Opcional)',
      upload: 'Subir Logo',
    },
    export: {
      copyTooltip: 'Copiar al Portapapeles',
    },
  },
  fr: {
    title: 'Générateur de Code QR Pro',
    inputLabel: 'Entrez le texte ou l\'URL',
    chooseStyle: 'Choisir un Style',
    format: {
      label: 'Format du Code QR',
      canvas: 'Canvas (Meilleur pour les petites tailles)',
      svg: 'SVG (Meilleur pour les grandes tailles)',
    },
    size: 'Taille (px)',
    errorLevel: {
      label: 'Niveau de Correction d\'Erreur',
      low: 'Bas (7%)',
      medium: 'Moyen (15%)',
      quartile: 'Quartile (25%)',
      high: 'Haut (30%)',
    },
    colors: {
      label: 'Couleurs Personnalisées',
      foreground: 'Couleur de Premier Plan',
      background: 'Couleur d\'Arrière-plan',
    },
    logo: {
      label: 'Logo (Optionnel)',
      upload: 'Télécharger Logo',
    },
    export: {
      copyTooltip: 'Copier dans le Presse-papier',
    },
  },
  de: {
    title: 'QR-Code Generator Pro',
    inputLabel: 'Text oder URL eingeben',
    chooseStyle: 'Style wählen',
    format: {
      label: 'QR-Code Format',
      canvas: 'Canvas (Besser für kleine Größen)',
      svg: 'SVG (Besser für große Größen)',
    },
    size: 'Größe (px)',
    errorLevel: {
      label: 'Fehlerkorrektur-Level',
      low: 'Niedrig (7%)',
      medium: 'Mittel (15%)',
      quartile: 'Quartil (25%)',
      high: 'Hoch (30%)',
    },
    colors: {
      label: 'Benutzerdefinierte Farben',
      foreground: 'Vordergrundfarbe',
      background: 'Hintergrundfarbe',
    },
    logo: {
      label: 'Logo (Optional)',
      upload: 'Logo hochladen',
    },
    export: {
      copyTooltip: 'In die Zwischenablage kopieren',
    },
  },
  ar: {
    title: 'مولد رمز QR برو',
    inputLabel: 'أدخل النص أو الرابط',
    chooseStyle: 'اختر النمط',
    format: {
      label: 'تنسيق رمز QR',
      canvas: 'كانفاس (أفضل للأحجام الصغيرة)',
      svg: 'SVG (أفضل للأحجام الكبيرة)',
    },
    size: 'الحجم (بكسل)',
    errorLevel: {
      label: 'مستوى تصحيح الخطأ',
      low: 'منخفض (7%)',
      medium: 'متوسط (15%)',
      quartile: 'ربعي (25%)',
      high: 'مرتفع (30%)',
    },
    colors: {
      label: 'ألوان مخصصة',
      foreground: 'لون المقدمة',
      background: 'لون الخلفية',
    },
    logo: {
      label: 'الشعار (اختياري)',
      upload: 'تحميل الشعار',
    },
    export: {
      copyTooltip: 'نسخ إلى الحافظة',
    },
  },
  zh: {
    title: 'QR码生成器专业版',
    inputLabel: '输入文本或网址',
    chooseStyle: '选择样式',
    format: {
      label: 'QR码格式',
      canvas: 'Canvas (适合小尺寸)',
      svg: 'SVG (适合大尺寸)',
    },
    size: '尺寸 (像素)',
    errorLevel: {
      label: '纠错等级',
      low: '低 (7%)',
      medium: '中 (15%)',
      quartile: '四分位 (25%)',
      high: '高 (30%)',
    },
    colors: {
      label: '自定义颜色',
      foreground: '前景色',
      background: '背景色',
    },
    logo: {
      label: '标志 (可选)',
      upload: '上传标志',
    },
    export: {
      copyTooltip: '复制到剪贴板',
    },
  },
  ja: {
    title: 'QRコードジェネレーター プロ',
    inputLabel: 'テキストまたはURLを入力',
    chooseStyle: 'スタイルを選択',
    format: {
      label: 'QRコード形式',
      canvas: 'キャンバス (小さなサイズに適しています)',
      svg: 'SVG (大きなサイズに適しています)',
    },
    size: 'サイズ (ピクセル)',
    errorLevel: {
      label: '誤り訂正レベル',
      low: '低 (7%)',
      medium: '中 (15%)',
      quartile: '四分位 (25%)',
      high: '高 (30%)',
    },
    colors: {
      label: 'カスタムカラー',
      foreground: '前景色',
      background: '背景色',
    },
    logo: {
      label: 'ロゴ (オプション)',
      upload: 'ロゴをアップロード',
    },
    export: {
      copyTooltip: 'クリップボードにコピー',
    },
  },
  ko: {
    title: 'QR코드 생성기 프로',
    inputLabel: '텍스트 또는 URL을 입력',
    chooseStyle: '스타일을 선택',
    format: {
      label: 'QR코드 형식',
      canvas: '캔버스 (작은 크기에 적합)',
      svg: 'SVG (큰 크기에 적합)',
    },
    size: '크기 (픽셀)',
    errorLevel: {
      label: '오류 정정 수준',
      low: '낮은 (7%)',
      medium: '중간 (15%)',
      quartile: '사분위 (25%)',
      high: '높은 (30%)',
    },
    colors: {
      label: '사용자 정의 색상',
      foreground: '전경색',
      background: '배경색',
    },
    logo: {
      label: '로고 (선택)',
      upload: '로고를 업로드',
    },
    export: {
      copyTooltip: '클립보드로 복사',
    },
  },
  ru: {
    title: 'Генератор QR-кодов Pro',
    inputLabel: 'Введите текст или URL',
    chooseStyle: 'Выберите стиль',
    format: {
      label: 'Формат QR-кода',
      canvas: 'Канва (подходит для небольших размеров)',
      svg: 'SVG (подходит для больших размеров)',
    },
    size: 'Размер (пикселей)',
    errorLevel: {
      label: 'Уровень коррекции ошибок',
      low: 'Низкий (7%)',
      medium: 'Средний (15%)',
      quartile: 'Квартиль (25%)',
      high: 'Высокий (30%)',
    },
    colors: {
      label: 'Пользовательские цвета',
      foreground: 'Цвет переднего плана',
      background: 'Цвет фона',
    },
    logo: {
      label: 'Логотип (необязательно)',
      upload: 'Загрузить логотип',
    },
    export: {
      copyTooltip: 'Копировать в буфер обмена',
    },
  },
  pt: {
    title: 'Gerador de QR Code Pro',
    inputLabel: 'Digite o texto ou URL',
    chooseStyle: 'Escolha o estilo',
    format: {
      label: 'Formato do QR Code',
      canvas: 'Canvas (melhor para tamanhos pequenos)',
      svg: 'SVG (melhor para tamanhos grandes)',
    },
    size: 'Tamanho (pixels)',
    errorLevel: {
      label: 'Nível de correção de erros',
      low: 'Baixo (7%)',
      medium: 'Médio (15%)',
      quartile: 'Quartil (25%)',
      high: 'Alto (30%)',
    },
    colors: {
      label: 'Cores personalizadas',
      foreground: 'Cor do primeiro plano',
      background: 'Cor do fundo',
    },
    logo: {
      label: 'Logotipo (opcional)',
      upload: 'Carregar logotipo',
    },
    export: {
      copyTooltip: 'Copiar para a área de transferência',
    },
  },
  it: {
    title: 'Generatore di QR Code Pro',
    inputLabel: 'Inserisci il testo o l\'URL',
    chooseStyle: 'Scegli lo stile',
    format: {
      label: 'Formato del QR Code',
      canvas: 'Canvas (migliore per dimensioni piccole)',
      svg: 'SVG (migliore per dimensioni grandi)',
    },
    size: 'Dimensione (pixel)',
    errorLevel: {
      label: 'Livello di correzione degli errori',
      low: 'Basso (7%)',
      medium: 'Medio (15%)',
      quartile: 'Quartile (25%)',
      high: 'Alto (30%)',
    },
    colors: {
      label: 'Colori personalizzati',
      foreground: 'Colore del primo piano',
      background: 'Colore dello sfondo',
    },
    logo: {
      label: 'Logo (opzionale)',
      upload: 'Caricare logo',
    },
    export: {
      copyTooltip: 'Copia negli appunti',
    },
  },
  hi: {
    title: 'क्यूआर कोड जनरेटर प्रो',
    inputLabel: 'पाठ या यूआरएल दर्ज करें',
    chooseStyle: 'शैली चुनें',
    format: {
      label: 'क्यूआर कोड प्रारूप',
      canvas: 'कैनवास (छोटे आकार के लिए उपयुक्त)',
      svg: 'एसवीजी (बड़े आकार के लिए उपयुक्त)',
    },
    size: 'आकार (पिक्सेल)',
    errorLevel: {
      label: 'त्रुटि सुधार स्तर',
      low: 'कम (7%)',
      medium: 'मध्यम (15%)',
      quartile: 'चतुर्थांश (25%)',
      high: 'उच्च (30%)',
    },
    colors: {
      label: 'कस्टम रंग',
      foreground: 'पूर्वभूमि रंग',
      background: 'पृष्ठभूमि रंग',
    },
    logo: {
      label: 'लोगो (वैकल्पिक)',
      upload: 'लोगो अपलोड करें',
    },
    export: {
      copyTooltip: 'क्लिपबोर्ड में कॉपी करें',
    },
  },
};

type Language = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'zh' | 'ja' | 'ko' | 'ru' | 'pt' | 'it' | 'hi';

interface QRCodeOptions {
  text: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  fgColor: string;
  bgColor: string;
  includeMargin: boolean;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

interface Template {
  id: string;
  name: string;
  preview: string;
  styles: Partial<QRCodeOptions>;
}

const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    preview: 'classic-preview.png',
    styles: {
      fgColor: '#000000',
      bgColor: '#FFFFFF',
    }
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    preview: 'modern-blue-preview.png',
    styles: {
      fgColor: '#2196F3',
      bgColor: '#EEF5FF',
    }
  },
  {
    id: 'corporate',
    name: 'Corporate',
    preview: 'corporate-preview.png',
    styles: {
      fgColor: '#1E3A8A',
      bgColor: '#F8FAFC',
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: 'sunset-preview.png',
    styles: {
      fgColor: '#F97316',
      bgColor: '#FFF7ED',
    }
  },
  {
    id: 'nature',
    name: 'Nature',
    preview: 'nature-preview.png',
    styles: {
      fgColor: '#059669',
      bgColor: '#ECFDF5',
    }
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    preview: 'dark-mode-preview.png',
    styles: {
      fgColor: '#F1F5F9',
      bgColor: '#0F172A',
    }
  },
  {
    id: 'purple-rain',
    name: 'Purple Rain',
    preview: 'purple-rain-preview.png',
    styles: {
      fgColor: '#7C3AED',
      bgColor: '#F5F3FF',
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    preview: 'ocean-preview.png',
    styles: {
      fgColor: '#0891B2',
      bgColor: '#ECFEFF',
    }
  },
  {
    id: 'coral',
    name: 'Coral',
    preview: 'coral-preview.png',
    styles: {
      fgColor: '#E11D48',
      bgColor: '#FFF1F2',
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    preview: 'minimal-preview.png',
    styles: {
      fgColor: '#334155',
      bgColor: '#F8FAFC',
    }
  },
  {
    id: 'golden',
    name: 'Golden',
    preview: 'golden-preview.png',
    styles: {
      fgColor: '#B45309',
      bgColor: '#FFFBEB',
    }
  },
  {
    id: 'emerald',
    name: 'Emerald',
    preview: 'emerald-preview.png',
    styles: {
      fgColor: '#047857',
      bgColor: '#ECFDF5',
    }
  }
];

// Predefined text options with icons
const textOptions = [
  { value: '', label: 'Select an option', icon: null },
  { value: 'https://www.facebook.com', label: 'Facebook', icon: null },
  { value: 'https://www.twitter.com', label: 'Twitter', icon: null },
  { value: 'https://www.linkedin.com', label: 'LinkedIn', icon: null },
  { value: 'https://www.instagram.com', label: 'Instagram', icon: null },
  { value: 'https://www.youtube.com', label: 'YouTube', icon: null },
  { value: 'https://www.github.com', label: 'GitHub', icon: null },
  { value: 'https://www.reddit.com', label: 'Reddit', icon: null },
  { value: 'https://www.whatsapp.com', label: 'WhatsApp', icon: null },
  { value: 'https://www.telegram.org', label: 'Telegram', icon: null },
  { value: 'https://www.pinterest.com', label: 'Pinterest', icon: null },
  { value: 'mailto:', label: 'Email', icon: null },
  { value: 'custom', label: 'Custom Text', icon: null },
];

// Add more languages
const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ru', label: 'Русский' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'hi', label: 'हिन्दी' },
];

// API Documentation content
const ApiDocumentation = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        QR Code Generator API Documentation
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Integrate our powerful QR code generation API into your applications
      </Typography>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Getting Started" />
        <Tab label="Authentication" />
        <Tab label="Endpoints" />
        <Tab label="Examples" />
      </Tabs>

      {selectedTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Quick Start Guide
          </Typography>
          <Typography paragraph>
            Our REST API allows you to generate QR codes programmatically. Here's how to get started:
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Base URL
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              https://api.kamysoft.com/v1
            </Typography>
          </Paper>
        </Box>
      )}

      {selectedTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Authentication
          </Typography>
          <Typography paragraph>
            All API requests require an API key that should be included in the headers:
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {`{
  "Authorization": "Bearer YOUR_API_KEY"
}`}
            </Typography>
          </Paper>
        </Box>
      )}

      {selectedTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Endpoints
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  POST /qr/generate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generate a new QR code
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2">Request Body:</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50', my: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {`{
  "text": "string",
  "size": number,
  "format": "png" | "svg",
  "errorCorrection": "L" | "M" | "Q" | "H",
  "color": "string",
  "background": "string"
}`}
                  </Typography>
                </Paper>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {selectedTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Code Examples
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              JavaScript/TypeScript
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {`const response = await fetch('https://api.kamysoft.com/v1/qr/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: 'https://example.com',
    size: 200,
    format: 'png',
    errorCorrection: 'H',
    color: '#000000',
    background: '#FFFFFF'
  })
});

const data = await response.json();`}
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

function App() {
  const qrRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<QRCodeOptions>({
    text: '',
    size: 180,
    level: 'L',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    includeMargin: true,
  });
  const [format, setFormat] = useState<'canvas' | 'svg'>('canvas');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedOption, setSelectedOption] = useState('');
  const [customText, setCustomText] = useState('');
  const [showApiDocs, setShowApiDocs] = useState(false);
  const t = translations[language];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOptions(prev => ({
          ...prev,
          imageSettings: {
            src: e.target?.result as string,
            height: 24,
            width: 24,
            excavate: true,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setOptions(prev => ({
        ...prev,
        ...template.styles,
      }));
    }
  };

  const handleExport = async (exportFormat: 'png' | 'svg' | 'pdf') => {
    if (!qrRef.current || !options.text) return;

    try {
      switch (exportFormat) {
        case 'png':
          const pngData = await toPng(qrRef.current);
          saveAs(pngData, 'qrcode.png');
          break;
        case 'svg':
          const svgData = await toSvg(qrRef.current);
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          saveAs(blob, 'qrcode.svg');
          break;
        case 'pdf':
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
          });
          const imgData = await toPng(qrRef.current);
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('qrcode.pdf');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const copyToClipboard = async () => {
    if (!qrRef.current) return;
    try {
      const pngData = await toPng(qrRef.current);
      const blob = await fetch(pngData).then(res => res.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img 
              src="/kamysoft-logo.png" 
              alt="KamySoft" 
              style={{ height: 45, width: 'auto' }}
            />
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              KamySoft
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<ApiIcon />}
              onClick={() => setShowApiDocs(true)}
              sx={{ textDecoration: 'none' }}
            >
              API Docs
            </Button>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
          py: 4,
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            {/* SEO Content */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {t.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                Create professional QR codes instantly for your business or personal use.
                Share your social media profiles, websites, and contact information effortlessly.
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>{t.inputLabel}</InputLabel>
                    <Select
                      value={selectedOption}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedOption(value);
                        if (value === 'custom') {
                          setOptions(prev => ({ ...prev, text: customText }));
                        } else {
                          setOptions(prev => ({ ...prev, text: value }));
                          setCustomText('');
                        }
                      }}
                    >
                      {textOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.icon && <Box sx={{ mr: 1 }}>{option.icon}</Box>}
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Link URL"
                    placeholder="https://"
                    value={options.text}
                    onChange={(e) => setOptions(prev => ({ ...prev, text: e.target.value }))}
                  />
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      {t.chooseStyle}
                    </Typography>
                    <Grid container spacing={2}>
                      {templates.map((template) => (
                        <Grid item xs={6} sm={4} md={3} key={template.id}>
                          <Paper 
                            className="template-card"
                            sx={{ 
                              cursor: 'pointer',
                              border: selectedTemplate === template.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 3,
                              },
                            }}
                            onClick={() => handleTemplateChange(template.id)}
                          >
                            <Box
                              className="template-preview"
                              sx={{
                                bgcolor: template.styles.bgColor,
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 120,
                                position: 'relative',
                                overflow: 'hidden',
                              }}
                            >
                              {/* QR Code Pattern */}
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  position: 'absolute',
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(7, 1fr)',
                                  gridTemplateRows: 'repeat(7, 1fr)',
                                  gap: '2px',
                                  padding: '8px',
                                }}
                              >
                                {/* Position Detection Pattern - Top Left */}
                                <Box sx={{ 
                                  gridColumn: '1 / 4',
                                  gridRow: '1 / 4',
                                  bgcolor: template.styles.fgColor,
                                  borderRadius: '4px',
                                  border: `2px solid ${template.styles.bgColor}`,
                                }} />
                                
                                {/* Position Detection Pattern - Top Right */}
                                <Box sx={{ 
                                  gridColumn: '5 / 8',
                                  gridRow: '1 / 4',
                                  bgcolor: template.styles.fgColor,
                                  borderRadius: '4px',
                                  border: `2px solid ${template.styles.bgColor}`,
                                }} />
                                
                                {/* Position Detection Pattern - Bottom Left */}
                                <Box sx={{ 
                                  gridColumn: '1 / 4',
                                  gridRow: '5 / 8',
                                  bgcolor: template.styles.fgColor,
                                  borderRadius: '4px',
                                  border: `2px solid ${template.styles.bgColor}`,
                                }} />
                                
                                {/* Data Pattern */}
                                {[...Array(12)].map((_, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      gridColumn: ((index % 4) + 3),
                                      gridRow: Math.floor(index / 4) + 3,
                                      bgcolor: template.styles.fgColor,
                                      borderRadius: '2px',
                                      border: `1px solid ${template.styles.bgColor}`,
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                            <Box sx={{ p: 1.5, bgcolor: 'background.paper' }}>
                              <Typography 
                                variant="body2" 
                                align="center"
                                sx={{ 
                                  fontWeight: selectedTemplate === template.id ? 600 : 400,
                                  color: selectedTemplate === template.id ? 'primary.main' : 'text.primary',
                                }}
                              >
                                {template.name}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>{t.format.label}</InputLabel>
                    <Select
                      value={format}
                      label={t.format.label}
                      onChange={(e) => setFormat(e.target.value as 'canvas' | 'svg')}
                    >
                      <MenuItem value="canvas">{t.format.canvas}</MenuItem>
                      <MenuItem value="svg">{t.format.svg}</MenuItem>
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography gutterBottom>{t.size}</Typography>
                    <Slider
                      value={options.size}
                      onChange={(_, newValue) => setOptions(prev => ({ ...prev, size: newValue as number }))}
                      min={128}
                      max={512}
                      step={32}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>{t.errorLevel.label}</InputLabel>
                    <Select
                      value={options.level}
                      label={t.errorLevel.label}
                      onChange={(e) => setOptions(prev => ({ ...prev, level: e.target.value as 'L' | 'M' | 'Q' | 'H' }))}
                    >
                      <MenuItem value="L">{t.errorLevel.low}</MenuItem>
                      <MenuItem value="M">{t.errorLevel.medium}</MenuItem>
                      <MenuItem value="Q">{t.errorLevel.quartile}</MenuItem>
                      <MenuItem value="H">{t.errorLevel.high}</MenuItem>
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography gutterBottom>{t.colors.label}</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label={t.colors.foreground}
                          type="color"
                          value={options.fgColor}
                          onChange={(e) => setOptions(prev => ({ ...prev, fgColor: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label={t.colors.background}
                          type="color"
                          value={options.bgColor}
                          onChange={(e) => setOptions(prev => ({ ...prev, bgColor: e.target.value }))}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box>
                    <Typography gutterBottom>{t.logo.label}</Typography>
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload">
                      <Button variant="outlined" component="span" fullWidth>
                        {t.logo.upload}
                      </Button>
                    </label>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setOptions({
                          text: '',
                          size: 180,
                          level: 'L',
                          fgColor: '#000000',
                          bgColor: '#FFFFFF',
                          includeMargin: true,
                        });
                        setSelectedOption('');
                        setCustomText('');
                      }}
                      startIcon={<RestartAlt />}
                    >
                      Reset
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleExport('png')}
                      startIcon={<Download />}
                      disabled={!options.text}
                    >
                      Download
                    </Button>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 2,
                  height: '100%',
                  justifyContent: 'center'
                }}>
                  <Paper 
                    elevation={2} 
                    sx={{ p: 2, bgcolor: options.bgColor }} 
                    ref={qrRef}
                  >
                    {format === 'canvas' ? (
                      <QRCodeCanvas
                        value={options.text || ' '}
                        size={options.size}
                        level={options.level}
                        fgColor={options.fgColor}
                        bgColor={options.bgColor}
                        includeMargin={options.includeMargin}
                        imageSettings={options.imageSettings}
                      />
                    ) : (
                      <QRCodeSVG
                        value={options.text || ' '}
                        size={options.size}
                        level={options.level}
                        fgColor={options.fgColor}
                        bgColor={options.bgColor}
                        includeMargin={options.includeMargin}
                        imageSettings={options.imageSettings}
                      />
                    )}
                  </Paper>

                  <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleExport('png')}
                      startIcon={<Download />}
                      disabled={!options.text}
                    >
                      PNG
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleExport('svg')}
                      startIcon={<Download />}
                      disabled={!options.text}
                    >
                      SVG
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleExport('pdf')}
                      startIcon={<Download />}
                      disabled={!options.text}
                    >
                      PDF
                    </Button>
                    <Tooltip title={t.export.copyTooltip}>
                      <span>
                        <IconButton 
                          onClick={copyToClipboard} 
                          color="primary"
                          disabled={!options.text}
                        >
                          <ContentCopy />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body1" align="center">
            2025 KamySoft. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <IconButton 
              color="inherit" 
              size="small" 
              component="a" 
              href="https://facebook.com" 
              target="_blank"
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              <FacebookIcon sx={{ fontSize: 24 }} />
            </IconButton>
            <IconButton 
              color="inherit" 
              size="small" 
              component="a" 
              href="https://twitter.com" 
              target="_blank"
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              <TwitterIcon sx={{ fontSize: 24 }} />
            </IconButton>
            <IconButton 
              color="inherit" 
              size="small" 
              component="a" 
              href="https://linkedin.com" 
              target="_blank"
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              <LinkedInIcon sx={{ fontSize: 24 }} />
            </IconButton>
            <IconButton 
              color="inherit" 
              size="small" 
              component="a" 
              href="https://instagram.com" 
              target="_blank"
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              <InstagramIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      {/* API Documentation Dialog */}
      <Dialog
        open={showApiDocs}
        onClose={() => setShowApiDocs(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">API Documentation</Typography>
            <IconButton onClick={() => setShowApiDocs(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ApiDocumentation />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default App;
