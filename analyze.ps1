# Full-site content analysis for biopreneur.com.ng scrape
$ErrorActionPreference = 'SilentlyContinue'

function Get-PlainText($html) {
  $t = $html -replace '(?s)<script.*?</script>', ' ' `
              -replace '(?s)<style.*?</style>', ' ' `
              -replace '(?s)<[^>]+>', ' '
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  $t -replace '\s+', ' '
}

function Get-ContentBlock($html) {
  $start = $html.IndexOf('class="entry-content')
  if ($start -lt 0) { return $null }
  $end = $html.IndexOf('class="ast-related-posts', $start)
  if ($end -lt 0) { $end = $html.IndexOf('id="comments', $start) }
  if ($end -lt 0) { $end = $html.Length }
  $html.Substring($start, $end - $start)
}

$categoryFiles = Get-ChildItem scrape -Filter 'category*.html' -ErrorAction SilentlyContinue

$rows = @()
foreach ($file in (Get-ChildItem scrape -Filter '*.html')) {
  $html = Get-Content $file.FullName -Raw
  if (-not $html) { continue }
  $slug = $file.BaseName

  # detect page type
  $isPost = $html -match 'class="entry-content' -and $html -match 'ast-related-posts|id="comments'
  $isCategory = $slug -like 'category*'

  # meta
  $meta = [regex]::Match($html, '<meta name="description" content="([^"]*)"').Groups[1].Value
  $title = [regex]::Match($html, '<title>([^<]*)</title>').Groups[1].Value

  $block = Get-ContentBlock $html
  $text = if ($block) { Get-PlainText $block } else { '' }
  $words = ($text -split '\s+' | Where-Object { $_ }).Count

  $h2 = ([regex]::Matches($block, '<h2')).Count
  $h3 = ([regex]::Matches($block, '<h3')).Count
  $tables = ([regex]::Matches($block, '<table')).Count
  $imgs = ([regex]::Matches($block, '<img')).Count
  $lists = ([regex]::Matches($block, '<ul|<ol')).Count
  $faq = ([regex]::Matches($block, 'FAQ')).Count
  $intLinks = ([regex]::Matches($block, 'href="https://biopreneur\.com\.ng/[^"]*"')).Count
  $extLinks = ([regex]::Matches($block, 'href="https?://(?!biopreneur\.com\.ng)[^"]*"')).Count
  $affLinks = ([regex]::Matches($block, 'hop\.clickbank\.net|amzn\.to|/product/')).Count

  # category from breadcrumb
  $cat = ([regex]::Match($html, 'category/([a-z-]+)/')).Groups[1].Value

  # date
  $date = [regex]::Match($html, '<time[^>]*datetime="([^"]+)"').Groups[1].Value
  if (-not $date) { $date = [regex]::Match($html, 'entry-date[^>]*>([A-Z][a-z]+ \d+, \d{4})').Groups[1].Value }

  $adsense = ([regex]::Matches($html, 'adsbygoogle')).Count

  $rows += [pscustomobject]@{
    Slug = $slug
    Type = if ($isCategory) {'category'} elseif ($isPost) {'post'} else {'page'}
    Cat = $cat
    Date = $date
    Words = $words
    H2 = $h2; H3 = $h3; Tables = $tables; Imgs = $imgs; Lists = $lists
    IntLinks = $intLinks; ExtLinks = $extLinks; AffLinks = $affLinks
    MetaLen = $meta.Length
    TitleLen = $title.Length
    AdSenseBlocks = $adsense
  }
}

$rows | Export-Csv site_stats.csv -NoTypeInformation -Encoding UTF8

# SUMMARY
$posts = $rows | Where-Object Type -eq 'post'
"=== POST COUNT: $($posts.Count) ==="
""
"=== WORD COUNT DISTRIBUTION (posts) ==="
$posts | Measure-Object Words -Average -Minimum -Maximum | ForEach-Object {
  "Min: $($_.Minimum)  Max: $($_.Maximum)  Avg: $([math]::Round($_.Average))"
}
$posts | Group-Object { 
  switch ($_.Words) { {$_ -lt 500} {'<500'} {$_ -lt 1000} {'500-999'} {$_ -lt 1500} {'1000-1499'} {$_ -lt 2000} {'1500-1999'} {$_ -lt 2500} {'2000-2499'} {$_ -lt 3000} {'2500-2999'} {$_ -lt 4000} {'3000-3999'} {$_ -lt 5000} {'4000-4999'} default {'5000+'} }
} | Sort-Object Name | ForEach-Object { "$($_.Name): $($_.Count) posts" }

""
"=== BY CATEGORY ==="
$posts | Group-Object Cat | Sort-Object Count -Descending | ForEach-Object {
  $w = $_.Group | Measure-Object Words -Average
  "$($_.Name -replace '^$','(none)') : $($_.Count) posts, avg words $([math]::Round($w.Average))"
}

""
"=== META DESCRIPTION ==="
$withMeta = ($posts | Where-Object MetaLen -gt 0).Count
"Avg meta length: $([math]::Round(($posts | Measure-Object MetaLen -Average).Average))"
"Posts with meta: $withMeta / $($posts.Count)"

""
"=== HEADINGS/TABLES/IMAGES (post averages) ==="
"H2 avg: $([math]::Round(($posts | Measure-Object H2 -Average).Average,1))"
"H3 avg: $([math]::Round(($posts | Measure-Object H3 -Average).Average,1))"
"Tables avg: $([math]::Round(($posts | Measure-Object Tables -Average).Average,1))"
"Images avg: $([math]::Round(($posts | Measure-Object Imgs -Average).Average,1))"
"Lists avg: $([math]::Round(($posts | Measure-Object Lists -Average).Average,1))"
"Internal links avg: $([math]::Round(($posts | Measure-Object IntLinks -Average).Average,1))"
"External links avg: $([math]::Round(($posts | Measure-Object ExtLinks -Average).Average,1))"
"Affiliate links avg: $([math]::Round(($posts | Measure-Object AffLinks -Average).Average,1))"

""
"=== ADSENSE ==="
$withAds = ($rows | Where-Object AdSenseBlocks -gt 0)
"Pages with adsbygoogle code: $($withAds.Count) / $($rows.Count)"

""
"=== DATES ==="
$posts | Group-Object { if ($_.Date) { $_.Date.Substring(0,7) } else { 'unknown' } } | Sort-Object Name | ForEach-Object { "$($_.Name): $($_.Count)" }
