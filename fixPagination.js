const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'apps/web/src/app/admin/dashboard');

// 1. Fix 'prev' error: My script replaced `(\s*)<\/div>\n(\s*)\)}\n(\s*)<\/div>` with pagination.
// In some files, maybe it replaced part of a JSX block inside a map function? No, `prev` is likely inside `setX(prev => prev.filter(...))`.
// Wait, the error is `Cannot find name 'prev'` at line 253 in careers/page.tsx.
// Ah, `{!isLoading && prev && prev.length > 0 && (` - wait, my regex found `prev.length === 0`?
// Let's check what `arrayName` got extracted for careers/page.tsx.
// `} : ([a-zA-Z]+).length === 0 ?` -> In careers, it might be `prev`? No.
// Let's fix them individually by reading the files.

const dirs = [
  'careers',
  'health-packages',
  'job-applications',
  'news',
  'sarc-enquiries',
  'services',
  'testimonials',
  'contact-enquiries',
  'site-settings'
];

dirs.forEach(dir => {
  const filePath = path.join(pagesDir, dir, 'page.tsx');
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix 'prev'
  if (dir === 'careers') content = content.replace(/prev && prev\.length > 0/g, 'careers && careers.length > 0');
  if (dir === 'health-packages') content = content.replace(/prev && prev\.length > 0/g, 'packages && packages.length > 0');
  if (dir === 'job-applications') content = content.replace(/prev && prev\.length > 0/g, 'applications && applications.length > 0');
  if (dir === 'news') content = content.replace(/prev && prev\.length > 0/g, 'news && news.length > 0');
  if (dir === 'sarc-enquiries') content = content.replace(/prev && prev\.length > 0/g, 'enquiries && enquiries.length > 0');
  if (dir === 'services') content = content.replace(/prev && prev\.length > 0/g, 'services && services.length > 0');
  if (dir === 'testimonials') content = content.replace(/prev && prev\.length > 0/g, 'testimonials && testimonials.length > 0');

  // Fix contact-enquiries missing Pagination and state (the regex probably failed because it doesn't have `const [total, setTotal] = useState(0);` maybe?)
  if (dir === 'contact-enquiries' && !content.includes('Pagination')) {
    content = content.replace(
      "import { useToast } from '@/components/admin/ToastProvider';",
      "import { useToast } from '@/components/admin/ToastProvider';\nimport { Pagination } from '@/components/admin/Pagination';"
    );
    // add state
    content = content.replace(
      /const \[enquiries, setEnquiries\] = useState<Enquiry\[\]>\(\[\]\);\n\s*const \[isLoading, setIsLoading\] = useState\(true\);\n\s*const \[search, setSearch\] = useState\(''\);/,
      "const [enquiries, setEnquiries] = useState<Enquiry[]>([]);\n  const [isLoading, setIsLoading] = useState(true);\n  const [search, setSearch] = useState('');\n  const [total, setTotal] = useState(0);\n  const [totalPages, setTotalPages] = useState(1);\n  const [page, setPage] = useState(1);"
    );
    // fix fetch
    content = content.replace(
      /fetchApi\(`\/api\/contact\?limit=50&search=\$\{encodeURIComponent\(search\)\}`\)/,
      "fetchApi(`/api/contact?limit=10&page=${page}&search=${encodeURIComponent(search)}`)"
    );
    content = content.replace(
      /setEnquiries\(res\.data \?\? \[\]\);/,
      "setEnquiries(res.data ?? []);\n      setTotal(res.pagination?.total ?? 0);\n      setTotalPages(res.pagination?.totalPages ?? 1);"
    );
    // fix useEffect
    content = content.replace(
      /useEffect\(\(\) => \{\n\s*const timer = setTimeout\(\(\) => loadData\(\), 400\);\n\s*return \(\) => clearTimeout\(timer\);\n\s*\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\n\s*\}, \[search\]\);/,
      `useEffect(() => {\n    setPage(1);\n  }, [search]);\n\n  useEffect(() => {\n    const timer = setTimeout(() => loadData(), 400);\n    return () => clearTimeout(timer);\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [search, page]);`
    );
  }

  // site-settings doesn't need pagination because it's a settings form!
  // It's not a list page. It shouldn't have been patched. I will revert site-settings.
  if (dir === 'site-settings') {
    content = content.replace(
      /import { Pagination } from '@\/components\/admin\/Pagination';\n/,
      ""
    );
    content = content.replace(
      /const \[totalPages, setTotalPages\] = useState\(1\);\n\s*const \[page, setPage\] = useState\(1\);/,
      ""
    );
    content = content.replace(
      /fetchApi\(`\/api\/settings\?limit=10&page=\$\{page\}&search=\$\{encodeURIComponent\(search\)\}`\)/,
      "fetchApi(`/api/settings`)"
    );
    content = content.replace(
      /useEffect\(\(\) => \{\n\s*setPage\(1\);\n\s*\}, \[search\]\);\n\n\s*useEffect\(\(\) => \{\n\s*const timer = setTimeout\(\(\) => loadData\(\), 400\);\n\s*return \(\) => clearTimeout\(timer\);\n\s*\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\n\s*\}, \[search, page\]\);/,
      "useEffect(() => {\n    loadData();\n  }, []);"
    );
    content = content.replace(
      /{!isLoading && items && items\.length > 0 && \(\n\s*<Pagination\n\s*currentPage={page}\n\s*totalPages={totalPages}\n\s*onPageChange={setPage}\n\s*\/>\n\s*\)}\n\s*/,
      ""
    );
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${dir}/page.tsx`);
});
