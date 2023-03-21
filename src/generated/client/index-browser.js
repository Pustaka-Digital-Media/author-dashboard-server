
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.6.1
 * Query Engine version: 694eea289a8462c80264df36757e4fdc129b1b32
 */
Prisma.prismaVersion = {
  client: "4.6.1",
  engine: "694eea289a8462c80264df36757e4fdc129b1b32"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val


/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.Amazon_booksScalarFieldEnum = makeEnum({
  id: 'id',
  activate: 'activate',
  reference_id: 'reference_id',
  print_book_isbn: 'print_book_isbn',
  eisbn: 'eisbn',
  imprint: 'imprint',
  title: 'title',
  author: 'author',
  editors: 'editors',
  illustrators: 'illustrators',
  contributors: 'contributors',
  translators: 'translators',
  photographers: 'photographers',
  language: 'language',
  digital_list_price_usd: 'digital_list_price_usd',
  digital_list_price_inr: 'digital_list_price_inr',
  release_date: 'release_date',
  publishing_date: 'publishing_date',
  description: 'description',
  bisac: 'bisac',
  bic: 'bic',
  territory: 'territory',
  exclude_territory: 'exclude_territory',
  adult_flag: 'adult_flag',
  edition: 'edition',
  series_title: 'series_title',
  series_number: 'series_number',
  volume: 'volume',
  keywords: 'keywords',
  asin: 'asin',
  amazon_url: 'amazon_url',
  book_id: 'book_id',
  author_id: 'author_id',
  copyright_owner: 'copyright_owner',
  language_id: 'language_id',
  status: 'status',
  ku_enabled: 'ku_enabled',
  ku_activation_date: 'ku_activation_date',
  ku_us_enabled: 'ku_us_enabled',
  ku_uk_enabled: 'ku_uk_enabled'
});

exports.Prisma.Amazon_transactionsScalarFieldEnum = makeEnum({
  id: 'id',
  invoice_date: 'invoice_date',
  original_invoice_date: 'original_invoice_date',
  asin: 'asin',
  physical_isbn10: 'physical_isbn10',
  physical_isbn13: 'physical_isbn13',
  digital_isbn: 'digital_isbn',
  title: 'title',
  author: 'author',
  units_purchased: 'units_purchased',
  units_refunded: 'units_refunded',
  net_units: 'net_units',
  net_units_mtd: 'net_units_mtd',
  adjustments_made: 'adjustments_made',
  list_price: 'list_price',
  list_price_currency: 'list_price_currency',
  publisher_price: 'publisher_price',
  publisher_price_currency: 'publisher_price_currency',
  discount_percentage: 'discount_percentage',
  payment_amount: 'payment_amount',
  payment_currency: 'payment_currency',
  program_type: 'program_type',
  book_id: 'book_id',
  author_id: 'author_id',
  user_id: 'user_id',
  copyright_owner: 'copyright_owner',
  language_id: 'language_id',
  currency_exchange: 'currency_exchange',
  inr_value: 'inr_value',
  tax_value: 'tax_value',
  final_royalty_value: 'final_royalty_value',
  status: 'status'
});

exports.Prisma.Audible_booksScalarFieldEnum = makeEnum({
  id: 'id',
  product_id: 'product_id',
  audible_asin: 'audible_asin',
  amazon_asin: 'amazon_asin',
  title: 'title',
  authors: 'authors',
  narrators: 'narrators',
  first_online_date: 'first_online_date',
  language_id: 'language_id',
  book_id: 'book_id',
  author_id: 'author_id',
  copyright_owner: 'copyright_owner'
});

exports.Prisma.Audible_transactionsScalarFieldEnum = makeEnum({
  id: 'id',
  royalty_earner: 'royalty_earner',
  parent_product_id: 'parent_product_id',
  name: 'name',
  author: 'author',
  isbn: 'isbn',
  provider_product_id: 'provider_product_id',
  market_place: 'market_place',
  offer: 'offer',
  royalty_rate: 'royalty_rate',
  alc_qty: 'alc_qty',
  alc_net_sales: 'alc_net_sales',
  alc_royalty: 'alc_royalty',
  al_qty: 'al_qty',
  al_net_sales: 'al_net_sales',
  al_royalty: 'al_royalty',
  alop_qty: 'alop_qty',
  alop_net_sales: 'alop_net_sales',
  alop_royalty: 'alop_royalty',
  total_qty: 'total_qty',
  total_net_sales: 'total_net_sales',
  total_royalty: 'total_royalty',
  book_id: 'book_id',
  author_id: 'author_id',
  language_id: 'language_id',
  copyright_owner: 'copyright_owner',
  user_id: 'user_id',
  final_royalty_value: 'final_royalty_value',
  transaction_date: 'transaction_date',
  status: 'status'
});

exports.Prisma.Audio_book_detailsScalarFieldEnum = makeEnum({
  id: 'id',
  book_id: 'book_id',
  chapter_id: 'chapter_id',
  chapter_name: 'chapter_name',
  chapter_name_english: 'chapter_name_english',
  chapter_url: 'chapter_url',
  chapter_duration: 'chapter_duration',
  created_at: 'created_at'
});

exports.Prisma.Author_gift_booksScalarFieldEnum = makeEnum({
  id: 'id',
  author_id: 'author_id',
  book_id: 'book_id',
  user_id: 'user_id',
  date: 'date',
  bookId: 'bookId'
});

exports.Prisma.Author_languageScalarFieldEnum = makeEnum({
  id: 'id',
  author_id: 'author_id',
  language_id: 'language_id',
  display_name1: 'display_name1',
  display_name2: 'display_name2',
  regional_author_name: 'regional_author_name'
});

exports.Prisma.Author_royalty_detailsScalarFieldEnum = makeEnum({
  id: 'id',
  copyright_owner: 'copyright_owner',
  author_id: 'author_id',
  pustaka: 'pustaka',
  amazon: 'amazon',
  kobo: 'kobo',
  scribd: 'scribd',
  google: 'google',
  overdrive: 'overdrive',
  storytel: 'storytel',
  audible: 'audible',
  settlement_date: 'settlement_date',
  bank_transaction_details: 'bank_transaction_details'
});

exports.Prisma.Author_tblScalarFieldEnum = makeEnum({
  author_id: 'author_id',
  author_name: 'author_name',
  url_name: 'url_name',
  author_type: 'author_type',
  author_image: 'author_image',
  copy_right_owner_name: 'copy_right_owner_name',
  relationship: 'relationship',
  mobile: 'mobile',
  phone: 'phone',
  email: 'email',
  address: 'address',
  fb_url: 'fb_url',
  twitter_url: 'twitter_url',
  blog_url: 'blog_url',
  description: 'description',
  status: 'status',
  created_at: 'created_at',
  activated_at: 'activated_at',
  created_by: 'created_by',
  gender: 'gender',
  copyright_owner: 'copyright_owner',
  user_id: 'user_id',
  narrator_id: 'narrator_id',
  amazon_link: 'amazon_link',
  pratilipi_link: 'pratilipi_link',
  audible_link: 'audible_link',
  odilo_link: 'odilo_link',
  scribd_link: 'scribd_link',
  googlebooks_link: 'googlebooks_link',
  storytel_link: 'storytel_link',
  overdrive_link: 'overdrive_link',
  pinterest_link: 'pinterest_link',
  agreement_details: 'agreement_details',
  agreement_ebook_count: 'agreement_ebook_count',
  agreement_audiobook_count: 'agreement_audiobook_count',
  agreement_paperback_count: 'agreement_paperback_count'
});

exports.Prisma.Author_transactionScalarFieldEnum = makeEnum({
  id: 'id',
  order_id: 'order_id',
  order_date: 'order_date',
  book_id: 'book_id',
  author_id: 'author_id',
  order_type: 'order_type',
  copy_right_seller: 'copy_right_seller',
  copy_right_lender: 'copy_right_lender',
  copyright_owner: 'copyright_owner',
  currency: 'currency',
  book_final_royalty_value_inr: 'book_final_royalty_value_inr',
  book_final_royalty_value_usd: 'book_final_royalty_value_usd',
  discount_provided: 'discount_provided',
  usd_exchange_rate: 'usd_exchange_rate',
  converted_book_final_royalty_value_inr: 'converted_book_final_royalty_value_inr',
  exchange_rate_comments: 'exchange_rate_comments',
  selling_royalty_percentage: 'selling_royalty_percentage',
  lending_royalty_percentage: 'lending_royalty_percentage',
  pay_status: 'pay_status',
  comments: 'comments'
});

exports.Prisma.Blog_commentsScalarFieldEnum = makeEnum({
  id: 'id',
  user_id: 'user_id',
  user_name: 'user_name',
  blog_name: 'blog_name',
  comments: 'comments',
  email_id: 'email_id',
  status: 'status',
  date_created: 'date_created'
});

exports.Prisma.Book_tblScalarFieldEnum = makeEnum({
  book_id: 'book_id',
  author_name: 'author_name',
  book_title: 'book_title',
  url_name: 'url_name',
  regional_book_title: 'regional_book_title',
  language: 'language',
  isbn_number: 'isbn_number',
  cover_image: 'cover_image',
  description: 'description',
  cost: 'cost',
  number_of_page: 'number_of_page',
  genre_id: 'genre_id',
  book_category: 'book_category',
  type_of_book: 'type_of_book',
  publisher: 'publisher',
  download_link: 'download_link',
  epub_url: 'epub_url',
  royalty: 'royalty',
  copyright_owner: 'copyright_owner',
  status: 'status',
  created_at: 'created_at',
  activated_at: 'activated_at',
  created_by: 'created_by',
  book_cost_international: 'book_cost_international',
  narrator_id: 'narrator_id',
  rental_cost_inr: 'rental_cost_inr',
  rental_cost_usd: 'rental_cost_usd',
  paper_back_flag: 'paper_back_flag',
  paper_back_inr: 'paper_back_inr',
  paper_back_royalty: 'paper_back_royalty',
  paper_back_readiness_flag: 'paper_back_readiness_flag',
  book_id_mapping: 'book_id_mapping',
  agreement_flag: 'agreement_flag',
  paper_back_pages: 'paper_back_pages',
  paper_back_weight: 'paper_back_weight',
  paper_back_copyright_owner: 'paper_back_copyright_owner',
  paper_back_isbn: 'paper_back_isbn',
  paper_back_remarks: 'paper_back_remarks',
  mintbook_cost: 'mintbook_cost'
});

exports.Prisma.Book_typesScalarFieldEnum = makeEnum({
  book_type_id: 'book_type_id',
  type_name: 'type_name',
  url_name: 'url_name',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at',
  image_url: 'image_url'
});

exports.Prisma.Books_metadataScalarFieldEnum = makeEnum({
  id: 'id',
  book_id: 'book_id',
  description: 'description',
  type_of_book: 'type_of_book',
  content_type: 'content_type',
  hard_copy_type: 'hard_copy_type',
  soft_copy_type: 'soft_copy_type',
  final_page_number: 'final_page_number',
  allocated_date: 'allocated_date',
  start_date: 'start_date',
  completion_date: 'completion_date',
  payment_date: 'payment_date',
  settled_page_number: 'settled_page_number',
  payment_status: 'payment_status',
  assigned_by: 'assigned_by',
  assigned_to: 'assigned_to',
  price_per_page: 'price_per_page',
  initial_page_number: 'initial_page_number',
  general_file_path: 'general_file_path',
  url_title: 'url_title',
  unique_key: 'unique_key',
  pustaka_cover_status: 'pustaka_cover_status',
  general_cover_status: 'general_cover_status',
  general_epub_status: 'general_epub_status',
  pustaka_epub_status: 'pustaka_epub_status',
  amazon_epub_status: 'amazon_epub_status',
  pustaka_flippdf_status: 'pustaka_flippdf_status',
  pustaka_word_status: 'pustaka_word_status',
  priority: 'priority',
  current_state: 'current_state',
  remarks: 'remarks'
});

exports.Prisma.Books_processingScalarFieldEnum = makeEnum({
  id: 'id',
  book_id: 'book_id',
  stage_id: 'stage_id',
  type_of_book: 'type_of_book',
  content_type: 'content_type',
  hard_copy_type: 'hard_copy_type',
  soft_copy_type: 'soft_copy_type',
  initial_page_number: 'initial_page_number',
  pustaka_cover_status: 'pustaka_cover_status',
  pustaka_epub_status: 'pustaka_epub_status',
  pustaka_flippdf_status: 'pustaka_flippdf_status',
  priority: 'priority',
  date_created: 'date_created',
  completed: 'completed',
  rework: 'rework'
});

exports.Prisma.Books_progressScalarFieldEnum = makeEnum({
  id: 'id',
  book_id: 'book_id',
  status: 'status',
  stage: 'stage',
  startdate: 'startdate',
  enddate: 'enddate',
  on_hold_startdate: 'on_hold_startdate',
  on_hold_enddate: 'on_hold_enddate',
  remarks: 'remarks'
});

exports.Prisma.Contact_usScalarFieldEnum = makeEnum({
  id: 'id',
  user_id: 'user_id',
  subject: 'subject',
  message: 'message',
  date_created: 'date_created'
});

exports.Prisma.Copyright_mappingScalarFieldEnum = makeEnum({
  id: 'id',
  copyright_owner: 'copyright_owner',
  author_id: 'author_id',
  date_created: 'date_created'
});

exports.Prisma.Episode_book_detailsScalarFieldEnum = makeEnum({
  id: 'id',
  episode_book_id: 'episode_book_id',
  chapter_name: 'chapter_name',
  chapter_name_english: 'chapter_name_english',
  chapter_epub_url: 'chapter_epub_url',
  chapter_num_pages: 'chapter_num_pages',
  chapter_status: 'chapter_status',
  chapter_activated_at: 'chapter_activated_at'
});

exports.Prisma.Episode_book_tblScalarFieldEnum = makeEnum({
  episode_book_id: 'episode_book_id',
  book_title: 'book_title',
  author_id: 'author_id',
  url_name: 'url_name',
  cover_image: 'cover_image',
  regional_book_title: 'regional_book_title',
  language: 'language',
  type_of_book: 'type_of_book',
  genre_id: 'genre_id',
  book_category: 'book_category',
  description: 'description',
  status: 'status',
  day_of_chapter: 'day_of_chapter',
  activated_at: 'activated_at'
});

exports.Prisma.Fixed_royaltyScalarFieldEnum = makeEnum({
  id: 'id',
  transaction_date: 'transaction_date',
  user_id: 'user_id',
  copyright_owner: 'copyright_owner',
  fixed_royalty_value: 'fixed_royalty_value',
  author_id: 'author_id',
  status: 'status'
});

exports.Prisma.Free_book_subscriptionScalarFieldEnum = makeEnum({
  seq_id: 'seq_id',
  user_id: 'user_id',
  book_id: 'book_id',
  date_subscribed: 'date_subscribed',
  comments: 'comments'
});

exports.Prisma.Genre_details_tblScalarFieldEnum = makeEnum({
  genre_id: 'genre_id',
  admin_id: 'admin_id',
  genre_name: 'genre_name',
  url_name: 'url_name',
  lang_0: 'lang_0',
  lang_1: 'lang_1',
  lang_2: 'lang_2',
  lang_3: 'lang_3',
  lang_4: 'lang_4',
  lang_5: 'lang_5',
  status: 'status',
  bisac_code: 'bisac_code',
  image_url: 'image_url'
});

exports.Prisma.Google_booksScalarFieldEnum = makeEnum({
  id: 'id',
  identifier: 'identifier',
  status: 'status',
  label: 'label',
  play_store_link: 'play_store_link',
  enable_for_sale: 'enable_for_sale',
  title: 'title',
  subtitle: 'subtitle',
  book_format: 'book_format',
  related_identifier: 'related_identifier',
  contributor: 'contributor',
  biographical_note: 'biographical_note',
  language: 'language',
  subject_code: 'subject_code',
  age_group: 'age_group',
  description: 'description',
  publication_date: 'publication_date',
  page_count: 'page_count',
  series_name: 'series_name',
  volume_in_series: 'volume_in_series',
  preview_type: 'preview_type',
  preview_territories: 'preview_territories',
  buy_link_text: 'buy_link_text',
  buy_link: 'buy_link',
  publisher_name: 'publisher_name',
  publisher_website: 'publisher_website',
  show_photos_preview: 'show_photos_preview',
  pdf_download: 'pdf_download',
  on_sale_date: 'on_sale_date',
  drm_enabled: 'drm_enabled',
  show_photos_ebook: 'show_photos_ebook',
  include_scanned_pages: 'include_scanned_pages',
  mature_audiences: 'mature_audiences',
  copy_paste_percentage: 'copy_paste_percentage',
  enable_school_use: 'enable_school_use',
  school_list_price_60: 'school_list_price_60',
  school_list_price_180: 'school_list_price_180',
  school_list_price_360: 'school_list_price_360',
  school_use_countries: 'school_use_countries',
  duration: 'duration',
  preview_length_minutes: 'preview_length_minutes',
  preview_length_percentage: 'preview_length_percentage',
  abridged_version: 'abridged_version',
  inr_price_including_tax: 'inr_price_including_tax',
  inr_countries_including_tax: 'inr_countries_including_tax',
  usd_price_including_tax: 'usd_price_including_tax',
  usd_countries_including_tax: 'usd_countries_including_tax',
  inr_price_excluding_tax: 'inr_price_excluding_tax',
  inr_countries_excluding_tax: 'inr_countries_excluding_tax',
  usd_price_excluding_tax: 'usd_price_excluding_tax',
  usd_countries_excluding_tax: 'usd_countries_excluding_tax',
  eur_price_including_tax: 'eur_price_including_tax',
  eur_price_excluding_tax: 'eur_price_excluding_tax',
  eur_countries_including_tax: 'eur_countries_including_tax',
  eur_countries_excluding_tax: 'eur_countries_excluding_tax',
  book_id: 'book_id',
  author_id: 'author_id',
  copyright_owner: 'copyright_owner',
  language_id: 'language_id',
  publish_date: 'publish_date'
});

exports.Prisma.Google_transactionsScalarFieldEnum = makeEnum({
  id: 'id',
  earnings_date: 'earnings_date',
  transaction_date: 'transaction_date',
  unique_id: 'unique_id',
  product: 'product',
  type: 'type',
  preorder: 'preorder',
  qty: 'qty',
  primary_isbn: 'primary_isbn',
  imprint_name: 'imprint_name',
  title: 'title',
  author: 'author',
  original_list_price_currency: 'original_list_price_currency',
  original_list_price: 'original_list_price',
  list_price_currency: 'list_price_currency',
  list_price_tax_inclusive: 'list_price_tax_inclusive',
  list_price_tax_exclusive: 'list_price_tax_exclusive',
  country_of_sale: 'country_of_sale',
  publisher_revenue_percentage: 'publisher_revenue_percentage',
  publisher_revenue: 'publisher_revenue',
  earnings_currency: 'earnings_currency',
  earnings_amount: 'earnings_amount',
  currency_conversion_rate: 'currency_conversion_rate',
  line_of_business: 'line_of_business',
  book_id: 'book_id',
  author_id: 'author_id',
  language_id: 'language_id',
  currency_exchange: 'currency_exchange',
  inr_value: 'inr_value',
  final_royalty_value: 'final_royalty_value',
  user_id: 'user_id',
  copyright_owner: 'copyright_owner',
  status: 'status'
});

exports.Prisma.Kobo_transactionScalarFieldEnum = makeEnum({
  id: 'id',
  transaction_date: 'transaction_date',
  country: 'country',
  state: 'state',
  zipcode: 'zipcode',
  content_type: 'content_type',
  quantity: 'quantity',
  refund_reason: 'refund_reason',
  dealID: 'dealID',
  publisher_name: 'publisher_name',
  imprint: 'imprint',
  eISBN: 'eISBN',
  author_name: 'author_name',
  book_title: 'book_title',
  list_price: 'list_price',
  tax_excluded: 'tax_excluded',
  COGS_percentage: 'COGS_percentage',
  COGS_amount: 'COGS_amount',
  list_price_currency: 'list_price_currency',
  foreign_exchange: 'foreign_exchange',
  COGS_payable: 'COGS_payable',
  COGS_based_lp: 'COGS_based_lp',
  COGS_based_lp_excluded_tax: 'COGS_based_lp_excluded_tax',
  COGS_based_lp_currency: 'COGS_based_lp_currency',
  COGS_adjustment: 'COGS_adjustment',
  net_due: 'net_due',
  payable_currency: 'payable_currency',
  total_tax: 'total_tax',
  book_id: 'book_id',
  author_id: 'author_id',
  paid_inr: 'paid_inr',
  user_id: 'user_id',
  copyright_owner: 'copyright_owner',
  status: 'status'
});

exports.Prisma.Language_tblScalarFieldEnum = makeEnum({
  language_id: 'language_id',
  admin_id: 'admin_id',
  language_name: 'language_name',
  regional_language_name: 'regional_language_name',
  url_name: 'url_name',
  image_url: 'image_url',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
});

exports.Prisma.Ledger_head_tblScalarFieldEnum = makeEnum({
  id: 'id',
  ledger_head_name: 'ledger_head_name',
  date_created: 'date_created'
});

exports.Prisma.Narrator_tblScalarFieldEnum = makeEnum({
  narrator_id: 'narrator_id',
  narrator_name: 'narrator_name',
  narrator_url: 'narrator_url',
  narrator_image: 'narrator_image',
  mobile: 'mobile',
  email: 'email',
  description: 'description',
  status: 'status',
  user_id: 'user_id',
  image_alt_text: 'image_alt_text',
  image_title_text: 'image_title_text',
  created_at: 'created_at'
});

exports.Prisma.Offline_paymentScalarFieldEnum = makeEnum({
  id: 'id',
  cart_type: 'cart_type',
  cart_items: 'cart_items',
  user_id: 'user_id',
  amount: 'amount',
  currency: 'currency',
  date_created: 'date_created',
  status: 'status'
});

exports.Prisma.OrderScalarFieldEnum = makeEnum({
  id: 'id',
  order_id: 'order_id',
  tracking_id: 'tracking_id',
  bank_ref_no: 'bank_ref_no',
  order_status: 'order_status',
  failure_message: 'failure_message',
  payment_mode: 'payment_mode',
  card_name: 'card_name',
  status_code: 'status_code',
  status_message: 'status_message',
  currency: 'currency',
  amount: 'amount',
  channel: 'channel',
  billing_name: 'billing_name',
  billing_address: 'billing_address',
  billing_city: 'billing_city',
  billing_state: 'billing_state',
  billing_zip: 'billing_zip',
  billing_country: 'billing_country',
  billing_tel: 'billing_tel',
  billing_email: 'billing_email',
  delivery_name: 'delivery_name',
  delivery_address: 'delivery_address',
  delivery_city: 'delivery_city',
  delivery_state: 'delivery_state',
  delivery_zip: 'delivery_zip',
  delivery_country: 'delivery_country',
  delivery_tel: 'delivery_tel',
  user_id: 'user_id',
  cart_type: 'cart_type',
  subtotal: 'subtotal',
  service_tax: 'service_tax',
  net_revenue: 'net_revenue',
  net_total: 'net_total',
  date_created: 'date_created',
  coupon_id: 'coupon_id',
  coupon_discount_amt: 'coupon_discount_amt'
});

exports.Prisma.Order_book_detailsScalarFieldEnum = makeEnum({
  book_order_id: 'book_order_id',
  order_id: 'order_id',
  user_id: 'user_id',
  book_id: 'book_id',
  book_cost: 'book_cost',
  order_type: 'order_type',
  start_date: 'start_date',
  end_date: 'end_date',
  order_date: 'order_date',
  rent_plan: 'rent_plan',
  author_id: 'author_id',
  language_id: 'language_id',
  copyright_owner: 'copyright_owner',
  channel: 'channel',
  status: 'status',
  date_created: 'date_created',
  user_ip: 'user_ip'
});

exports.Prisma.Overdrive_booksScalarFieldEnum = makeEnum({
  id: 'id',
  overdrive_id: 'overdrive_id',
  catalogue_id: 'catalogue_id',
  isbn: 'isbn',
  physical_isbn: 'physical_isbn',
  title: 'title',
  subtitle: 'subtitle',
  edition: 'edition',
  series: 'series',
  publisher: 'publisher',
  imprint: 'imprint',
  creators: 'creators',
  subject: 'subject',
  format: 'format',
  filesize: 'filesize',
  whs_usd: 'whs_usd',
  whs_usddiscount: 'whs_usddiscount',
  lib_usd: 'lib_usd',
  lib_usddiscount: 'lib_usddiscount',
  onsale_date: 'onsale_date',
  pub_date: 'pub_date',
  status: 'status',
  sample_link: 'sample_link',
  readbox_enabled: 'readbox_enabled',
  special_features: 'special_features',
  book_id: 'book_id',
  author_id: 'author_id',
  copyright_owner: 'copyright_owner',
  language_id: 'language_id',
  type_of_book: 'type_of_book'
});

exports.Prisma.Overdrive_transactionsScalarFieldEnum = makeEnum({
  id: 'id',
  transaction_date: 'transaction_date',
  overdrive_id: 'overdrive_id',
  isbn: 'isbn',
  title: 'title',
  subtitle: 'subtitle',
  author: 'author',
  retailer: 'retailer',
  country_of_sale: 'country_of_sale',
  format: 'format',
  srp_usd: 'srp_usd',
  discount: 'discount',
  amt_owed_usd: 'amt_owed_usd',
  book_id: 'book_id',
  author_id: 'author_id',
  language_id: 'language_id',
  exchange_rate: 'exchange_rate',
  inr_value: 'inr_value',
  final_royalty_value: 'final_royalty_value',
  user_id: 'user_id',
  copyright_owner: 'copyright_owner',
  status: 'status'
});

exports.Prisma.Payout_sessionScalarFieldEnum = makeEnum({
  session_id: 'session_id',
  session_data: 'session_data',
  user_id: 'user_id',
  order_id: 'order_id'
});

exports.Prisma.Plan_tblScalarFieldEnum = makeEnum({
  plan_id: 'plan_id',
  plan_name: 'plan_name',
  plan_display_name: 'plan_display_name',
  plan_url_name: 'plan_url_name',
  plan_type: 'plan_type',
  plan_image: 'plan_image',
  plan_cost: 'plan_cost',
  plan_caption: 'plan_caption',
  plan_cost_international: 'plan_cost_international',
  validity_days: 'validity_days',
  book_validity_days: 'book_validity_days',
  available_books: 'available_books',
  discount: 'discount',
  plan_intro_date: 'plan_intro_date',
  status: 'status'
});

exports.Prisma.Pod_cost_notificationScalarFieldEnum = makeEnum({
  id: 'id',
  user_id: 'user_id',
  book_id: 'book_id',
  date_created: 'date_created',
  mail_status: 'mail_status'
});

exports.Prisma.Pod_orderScalarFieldEnum = makeEnum({
  id: 'id',
  order_id: 'order_id',
  user_id: 'user_id',
  shipping_charges: 'shipping_charges',
  discount: 'discount',
  order_status: 'order_status',
  split_flag: 'split_flag',
  tracking_id: 'tracking_id',
  tracking_url: 'tracking_url',
  order_date: 'order_date'
});

exports.Prisma.Pod_order_detailsScalarFieldEnum = makeEnum({
  id: 'id',
  order_id: 'order_id',
  user_id: 'user_id',
  book_id: 'book_id',
  quantity: 'quantity',
  wrapper_type: 'wrapper_type',
  personalised_message: 'personalised_message',
  tracking_id: 'tracking_id',
  tracking_url: 'tracking_url',
  status: 'status',
  price: 'price',
  order_date: 'order_date'
});

exports.Prisma.Pod_processingScalarFieldEnum = makeEnum({
  id: 'id',
  book_id: 'book_id',
  stage_id: 'stage_id',
  content_type: 'content_type',
  word_page_number: 'word_page_number',
  pod_estimation_pages: 'pod_estimation_pages',
  cover_status: 'cover_status',
  priority: 'priority',
  date_created: 'date_created',
  completed: 'completed',
  rework: 'rework'
});

exports.Prisma.Pod_progressScalarFieldEnum = makeEnum({
  id: 'id',
  book_id: 'book_id',
  status: 'status',
  stage: 'stage',
  startdate: 'startdate',
  enddate: 'enddate',
  on_hold_startdate: 'on_hold_startdate',
  on_hold_enddate: 'on_hold_enddate',
  remarks: 'remarks',
  pause_startdate: 'pause_startdate',
  pause_enddate: 'pause_enddate'
});

exports.Prisma.Publisher_tblScalarFieldEnum = makeEnum({
  publisher_id: 'publisher_id',
  publisher_name: 'publisher_name',
  publisher_url_name: 'publisher_url_name',
  publisher_regional_name: 'publisher_regional_name',
  publisher_image: 'publisher_image',
  publisher_description: 'publisher_description',
  email_id: 'email_id',
  mobile: 'mobile',
  address: 'address',
  bank_acc_no: 'bank_acc_no',
  bank_acc_name: 'bank_acc_name',
  bank_acc_type: 'bank_acc_type',
  ifsc_code: 'ifsc_code',
  pan_number: 'pan_number',
  copyright_owner: 'copyright_owner',
  bonus_percentage: 'bonus_percentage',
  status: 'status',
  created_at: 'created_at',
  tds_flag: 'tds_flag'
});

exports.Prisma.Rating_reviewScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  user_id: 'user_id',
  book_id: 'book_id',
  comment: 'comment',
  rating: 'rating',
  status: 'status',
  date_created: 'date_created'
});

exports.Prisma.Razorpay_requestsScalarFieldEnum = makeEnum({
  id: 'id',
  user_id: 'user_id',
  plan_id: 'plan_id',
  razorpay_payload: 'razorpay_payload',
  created: 'created'
});

exports.Prisma.Royalty_settlementScalarFieldEnum = makeEnum({
  id: 'id',
  copy_right_owner_id: 'copy_right_owner_id',
  author_id: 'author_id',
  settlement_date: 'settlement_date',
  settlement_amount: 'settlement_amount',
  tds_amount: 'tds_amount',
  payment_type: 'payment_type',
  bank_transaction_details: 'bank_transaction_details',
  comments: 'comments',
  pustaka: 'pustaka',
  amazon: 'amazon',
  kobo: 'kobo',
  scribd: 'scribd',
  google: 'google',
  overdrive: 'overdrive',
  storytel: 'storytel',
  audible: 'audible',
  bonus_value: 'bonus_value'
});

exports.Prisma.Sales_consolidationScalarFieldEnum = makeEnum({
  id: 'id',
  author_id: 'author_id',
  book_id: 'book_id',
  month_year: 'month_year',
  genre_id: 'genre_id',
  language_id: 'language_id',
  type_of_book: 'type_of_book',
  book_cost: 'book_cost',
  downloads: 'downloads'
});

exports.Prisma.Scribd_booksScalarFieldEnum = makeEnum({
  id: 'id',
  updated_at: 'updated_at',
  import_id: 'import_id',
  doc_id: 'doc_id',
  identifier: 'identifier',
  title: 'title',
  published: 'published',
  in_subscription: 'in_subscription',
  product_page_url: 'product_page_url',
  imprints: 'imprints',
  status: 'status',
  publisher_tools_config_id: 'publisher_tools_config_id',
  metadata_status: 'metadata_status',
  conversion_status: 'conversion_status',
  product_page_pending: 'product_page_pending',
  subscription_pending: 'subscription_pending',
  book_id: 'book_id',
  author_id: 'author_id',
  copyright_owner: 'copyright_owner',
  language_id: 'language_id',
  duplicate_flag: 'duplicate_flag'
});

exports.Prisma.Scribd_transactionScalarFieldEnum = makeEnum({
  S_No: 'S_No',
  Payout_month: 'Payout_month',
  Publisher: 'Publisher',
  Amount_owed_for_this_interaction: 'Amount_owed_for_this_interaction',
  Amount_owed_currency: 'Amount_owed_currency',
  Price_in_original_currency: 'Price_in_original_currency',
  Digital_list_price: 'Digital_list_price',
  Original_currency: 'Original_currency',
  Price_type: 'Price_type',
  ISBN: 'ISBN',
  Title: 'Title',
  Authors: 'Authors',
  Imprints: 'Imprints',
  Viewed: 'Viewed',
  Payout_type: 'Payout_type',
  Start_date_of_interaction: 'Start_date_of_interaction',
  Last_date_of_interaction: 'Last_date_of_interaction',
  Country_of_reader: 'Country_of_reader',
  Unique_interaction_ID: 'Unique_interaction_ID',
  ISO_Country_Code: 'ISO_Country_Code',
  Threshold_Date: 'Threshold_Date',
  book_id: 'book_id',
  author_id: 'author_id',
  language_id: 'language_id',
  converted_inr: 'converted_inr',
  user_id: 'user_id',
  copyright_owner: 'copyright_owner',
  status: 'status',
  exchange_rate: 'exchange_rate',
  converted_inr_full: 'converted_inr_full'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.Storytel_booksScalarFieldEnum = makeEnum({
  id: 'id',
  storytel_book_id: 'storytel_book_id',
  isbn: 'isbn',
  title: 'title',
  author_name: 'author_name',
  narrator: 'narrator',
  category: 'category',
  publication_date: 'publication_date',
  book_id: 'book_id',
  author_id: 'author_id',
  copyright_owner: 'copyright_owner',
  language_id: 'language_id',
  genre_id: 'genre_id',
  type_of_book: 'type_of_book'
});

exports.Prisma.Storytel_transactionsScalarFieldEnum = makeEnum({
  id: 'id',
  author: 'author',
  title: 'title',
  isbn: 'isbn',
  country: 'country',
  price_model: 'price_model',
  no_of_units: 'no_of_units',
  net_receipts_per_hour_local: 'net_receipts_per_hour_local',
  ecb_exchange_rate: 'ecb_exchange_rate',
  net_receipts_per_hour_inr: 'net_receipts_per_hour_inr',
  book_length_in_hours: 'book_length_in_hours',
  price_per_unit: 'price_per_unit',
  remuneration_eur: 'remuneration_eur',
  remuneration_inr: 'remuneration_inr',
  publisher: 'publisher',
  imprint: 'imprint',
  consumption_dates: 'consumption_dates',
  book_type: 'book_type',
  book_id: 'book_id',
  author_id: 'author_id',
  language_id: 'language_id',
  user_id: 'user_id',
  copyright_owner: 'copyright_owner',
  final_royalty_value: 'final_royalty_value',
  transaction_date: 'transaction_date',
  status: 'status'
});

exports.Prisma.Subscribe_newsletterScalarFieldEnum = makeEnum({
  id: 'id',
  email_id: 'email_id',
  subscribe_date: 'subscribe_date'
});

exports.Prisma.SubscriptionScalarFieldEnum = makeEnum({
  id: 'id',
  order_id: 'order_id',
  user_id: 'user_id',
  subscription_id: 'subscription_id',
  plan_type: 'plan_type',
  number_of_days: 'number_of_days',
  start_date: 'start_date',
  end_date: 'end_date',
  total_books_applicable: 'total_books_applicable',
  date_inserted: 'date_inserted',
  status: 'status'
});

exports.Prisma.Today_dealsScalarFieldEnum = makeEnum({
  id: 'id',
  date: 'date',
  book_id: 'book_id',
  language_id: 'language_id',
  discount: 'discount',
  status: 'status',
  type: 'type'
});

exports.Prisma.Top_booksScalarFieldEnum = makeEnum({
  id: 'id',
  purpose: 'purpose',
  sales_count_by_bk_id: 'sales_count_by_bk_id',
  book_id: 'book_id',
  book_title: 'book_title',
  url_name: 'url_name',
  regional_book_title: 'regional_book_title',
  language_id: 'language_id',
  language_id_tmp: 'language_id_tmp',
  type_of_book: 'type_of_book',
  author_id: 'author_id',
  author_name: 'author_name',
  description: 'description',
  download_link: 'download_link',
  cover_image: 'cover_image',
  epub_url: 'epub_url',
  cost: 'cost',
  number_of_page: 'number_of_page',
  genre_id: 'genre_id',
  genre_id_tmp: 'genre_id_tmp',
  genre_name: 'genre_name',
  book_category: 'book_category'
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.User_addressScalarFieldEnum = makeEnum({
  user_id: 'user_id',
  billing_name: 'billing_name',
  billing_address1: 'billing_address1',
  billing_address2: 'billing_address2',
  billing_area_name: 'billing_area_name',
  billing_landmark: 'billing_landmark',
  billing_city: 'billing_city',
  billing_state: 'billing_state',
  billing_pincode: 'billing_pincode',
  billing_mobile_no: 'billing_mobile_no',
  billing_alternate_no: 'billing_alternate_no',
  shipping_name: 'shipping_name',
  shipping_address1: 'shipping_address1',
  shipping_address2: 'shipping_address2',
  shipping_area_name: 'shipping_area_name',
  shipping_landmark: 'shipping_landmark',
  shipping_city: 'shipping_city',
  shipping_state: 'shipping_state',
  shipping_pincode: 'shipping_pincode',
  shipping_mobile_no: 'shipping_mobile_no',
  shipping_alternate_no: 'shipping_alternate_no'
});

exports.Prisma.User_devicesScalarFieldEnum = makeEnum({
  user_id: 'user_id',
  device_id1: 'device_id1',
  device_info1: 'device_info1',
  device_id2: 'device_id2',
  device_info2: 'device_info2',
  device_id3: 'device_id3',
  device_info3: 'device_info3',
  created_at: 'created_at',
  updated_at: 'updated_at'
});

exports.Prisma.User_subscription_tblScalarFieldEnum = makeEnum({
  subscription_id: 'subscription_id',
  user_id: 'user_id',
  user_email_id: 'user_email_id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  created_by: 'created_by',
  updated_by: 'updated_by'
});

exports.Prisma.User_walletScalarFieldEnum = makeEnum({
  id: 'id',
  user_id: 'user_id',
  balance_inr: 'balance_inr',
  balance_usd: 'balance_usd',
  date: 'date'
});

exports.Prisma.User_wallet_transactionScalarFieldEnum = makeEnum({
  id: 'id',
  user_id: 'user_id',
  order_id: 'order_id',
  amount: 'amount',
  currency: 'currency',
  transaction_type: 'transaction_type',
  balance_inr: 'balance_inr',
  balance_usd: 'balance_usd',
  date: 'date'
});

exports.Prisma.Users_tblScalarFieldEnum = makeEnum({
  user_id: 'user_id',
  username: 'username',
  password: 'password',
  dob: 'dob',
  gender: 'gender',
  phone: 'phone',
  language_id: 'language_id',
  genre_ids: 'genre_ids',
  address: 'address',
  city: 'city',
  zipcode: 'zipcode',
  country: 'country',
  user_type: 'user_type',
  created_at: 'created_at',
  email: 'email',
  secret_code: 'secret_code',
  channel: 'channel',
  profile_img_url: 'profile_img_url'
});

exports.Prisma.Wallet_order_tblScalarFieldEnum = makeEnum({
  id: 'id',
  order_id: 'order_id',
  user_id: 'user_id',
  cart_type: 'cart_type',
  currency: 'currency',
  subtotal: 'subtotal',
  service_tax: 'service_tax',
  net_total: 'net_total',
  discount: 'discount'
});

exports.Prisma.Wallet_transaction_typeScalarFieldEnum = makeEnum({
  transaction_type: 'transaction_type',
  transaction_value: 'transaction_value'
});

exports.Prisma.WishlistScalarFieldEnum = makeEnum({
  id: 'id',
  book_id: 'book_id',
  user_id: 'user_id',
  date_created: 'date_created'
});


exports.Prisma.ModelName = makeEnum({
  amazon_books: 'amazon_books',
  amazon_transactions: 'amazon_transactions',
  audible_books: 'audible_books',
  audible_transactions: 'audible_transactions',
  audio_book_details: 'audio_book_details',
  author_gift_books: 'author_gift_books',
  author_language: 'author_language',
  author_royalty_details: 'author_royalty_details',
  author_tbl: 'author_tbl',
  author_transaction: 'author_transaction',
  blog_comments: 'blog_comments',
  book_tbl: 'book_tbl',
  book_types: 'book_types',
  books_metadata: 'books_metadata',
  books_processing: 'books_processing',
  books_progress: 'books_progress',
  contact_us: 'contact_us',
  copyright_mapping: 'copyright_mapping',
  episode_book_details: 'episode_book_details',
  episode_book_tbl: 'episode_book_tbl',
  fixed_royalty: 'fixed_royalty',
  free_book_subscription: 'free_book_subscription',
  genre_details_tbl: 'genre_details_tbl',
  google_books: 'google_books',
  google_transactions: 'google_transactions',
  kobo_transaction: 'kobo_transaction',
  language_tbl: 'language_tbl',
  ledger_head_tbl: 'ledger_head_tbl',
  narrator_tbl: 'narrator_tbl',
  offline_payment: 'offline_payment',
  order: 'order',
  order_book_details: 'order_book_details',
  overdrive_books: 'overdrive_books',
  overdrive_transactions: 'overdrive_transactions',
  payout_session: 'payout_session',
  plan_tbl: 'plan_tbl',
  pod_cost_notification: 'pod_cost_notification',
  pod_order: 'pod_order',
  pod_order_details: 'pod_order_details',
  pod_processing: 'pod_processing',
  pod_progress: 'pod_progress',
  publisher_tbl: 'publisher_tbl',
  rating_review: 'rating_review',
  razorpay_requests: 'razorpay_requests',
  royalty_settlement: 'royalty_settlement',
  sales_consolidation: 'sales_consolidation',
  scribd_books: 'scribd_books',
  scribd_transaction: 'scribd_transaction',
  storytel_books: 'storytel_books',
  storytel_transactions: 'storytel_transactions',
  subscribe_newsletter: 'subscribe_newsletter',
  subscription: 'subscription',
  today_deals: 'today_deals',
  top_books: 'top_books',
  user_address: 'user_address',
  user_devices: 'user_devices',
  user_subscription_tbl: 'user_subscription_tbl',
  user_wallet: 'user_wallet',
  user_wallet_transaction: 'user_wallet_transaction',
  users_tbl: 'users_tbl',
  wallet_order_tbl: 'wallet_order_tbl',
  wallet_transaction_type: 'wallet_transaction_type',
  wishlist: 'wishlist'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
