const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'apps/web/src/app/admin/dashboard');

// The directories containing the list pages
const dirs = [
  'doctors',
  'services',
  'careers',
  'news',
  'testimonials',
  'health-packages',
  'job-applications',
  'contact-enquiries',
  'sarc-enquiries',
  'site-settings'
];

dirs.forEach(dir => {
  const filePath = path.join(pagesDir, dir, 'page.tsx');
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if it already has Pagination to avoid double insertion
  if (content.includes('Pagination')) return;
  
  // 1. Add Import
  content = content.replace(
    "import { useToast } from '@/components/admin/ToastProvider';",
    "import { useToast } from '@/components/admin/ToastProvider';\nimport { Pagination } from '@/components/admin/Pagination';"
  );
  
  // 2. Add state variables for pagination
  // Find where const [total, setTotal] = useState(0); is declared
  content = content.replace(
    /const\s+\[total,\s*setTotal\]\s*=\s*useState\(0\);/,
    `const [total, setTotal] = useState(0);\n  const [totalPages, setTotalPages] = useState(1);\n  const [page, setPage] = useState(1);`
  );
  
  // 3. Update the loadData fetch URL and setTotalPages
  // Match `fetchApi(...limit=50...)`
  content = content.replace(
    /fetchApi\(`(\/api\/[a-zA-Z-]+)\?limit=50&search=\$\{encodeURIComponent\(search\)\}`\)/g,
    `fetchApi(\`$1?limit=10&page=\${page}&search=\${encodeURIComponent(search)}\`)`
  );
  
  // also handle the setTotalPages in loadData
  // Find setTotal(res.pagination?.total ?? 0);
  content = content.replace(
    /setTotal\(res\.pagination\?\.total \?\? 0\);/g,
    `setTotal(res.pagination?.total ?? 0);\n      setTotalPages(res.pagination?.totalPages ?? 1);`
  );
  
  // 4. Update the useEffect for search and loadData
  content = content.replace(
    /useEffect\(\(\) => \{\n\s*const timer = setTimeout\(\(\) => loadData\(\), 400\);\n\s*return \(\) => clearTimeout\(timer\);\n\s*\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\n\s*\}, \[search\]\);/,
    `useEffect(() => {\n    setPage(1);\n  }, [search]);\n\n  useEffect(() => {\n    const timer = setTimeout(() => loadData(), 400);\n    return () => clearTimeout(timer);\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [search, page]);`
  );

  // 5. Add the Pagination component at the bottom before closing the outer card div
  // The outer card usually ends with:
  //       </div>
  //     )}
  //   </div>
  // </div>
  // Let's replace:
  //           </div>\n        )}\n      </div>
  // with the pagination
  
  // First, find the variable name for the array (e.g., doctors, services)
  // We can look for `} : ([a-zA-Z]+).length === 0 ?`
  const arrayNameMatch = content.match(/} : ([a-zA-Z]+)\.length === 0 \?/);
  let arrayName = 'items';
  if (arrayNameMatch) {
    arrayName = arrayNameMatch[1];
  } else {
    const backupMatch = content.match(/\n\s*([a-zA-Z]+)\.map\(/);
    if(backupMatch) arrayName = backupMatch[1];
  }
  
  content = content.replace(
    /(\s*)<\/div>\n(\s*)\)}\n(\s*)<\/div>/g,
    `$1<\/div>\n$2)}\n        \n        {!isLoading && ${arrayName} && ${arrayName}.length > 0 && (\n          <Pagination\n            currentPage={page}\n            totalPages={totalPages}\n            onPageChange={setPage}\n          />\n        )}\n$3</div>`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${dir}/page.tsx`);
});
