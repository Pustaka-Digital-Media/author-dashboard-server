"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoyaltySummaryData = void 0;
const client_1 = require("@prisma/client");
const globals_1 = require("../utils/globals");
const prisma = new client_1.PrismaClient({});
const getRoyaltySummaryData = async (req, res) => {
    const authorId = parseInt(req.body.authorId);
    const result = {};
    result["royaltySummary"] = {};
    const fyStartDate = "2014-04-01";
    const fyEndDate = "2023-03-31";
    const totalEarningsData = await prisma.$queryRaw `SELECT temp.author_id, author_tbl.author_name,
      sum(temp.pustaka_earnings)+sum(temp.amazon_earnings)+sum(temp.scribd_earnings)+sum(temp.kobo_earnings)+sum(temp.google_earnings)+sum(temp.overdrive_earnings)+sum(temp.storytel_earnings)+sum(temp.audible_earnings) temp_all_sale FROM
      (
        SELECT author_id, (converted_book_final_royalty_value_inr+book_final_royalty_value_inr) as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, order_date temp_ord_dt FROM author_transaction where author_id = ${authorId} and order_date >= ${fyStartDate} and order_date <= ${fyEndDate}
        UNION ALL
          SELECT author_id, 0 as pustaka_earnings, final_royalty_value as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, invoice_date temp_ord_dt FROM amazon_transactions where author_id = ${authorId} and invoice_date >= ${fyStartDate} and invoice_date <= ${fyEndDate}
        UNION ALL
          SELECT author_id, 0 as pustaka_earnings, 0 as amazon_earnings, converted_inr as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, payout_month temp_ord_dt from scribd_transaction where author_id = ${authorId} and payout_month >= ${fyStartDate} and payout_month <= ${fyEndDate}
        UNION ALL
          SELECT author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, paid_inr as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, transaction_date temp_ord_dt FROM kobo_transaction where author_id = ${authorId} and transaction_date >= ${fyStartDate} and transaction_date <= ${fyEndDate}
        UNION ALL
          select author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, final_royalty_value as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, earnings_date temp_ord_dt FROM google_transactions where author_id = ${authorId} and earnings_date >= ${fyStartDate} and earnings_date <= ${fyEndDate}
        UNION ALL
          select author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, final_royalty_value as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, transaction_date temp_ord_dt FROM overdrive_transactions where author_id = ${authorId} and transaction_date >= ${fyStartDate} and transaction_date <= ${fyEndDate}
        UNION ALL
          select author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, final_royalty_value as storytel_earnings, 0 as audible_earnings, transaction_date temp_ord_dt FROM storytel_transactions where author_id = ${authorId} and transaction_date >= ${fyStartDate} and transaction_date <= ${fyEndDate}
        UNION ALL
          select author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, final_royalty_value as audible_earnings, transaction_date temp_ord_dt FROM audible_transactions where author_id = ${authorId} and transaction_date >= ${fyStartDate} and transaction_date <= ${fyEndDate}
        ) temp,
      author_tbl
    WHERE
    author_tbl.author_id=temp.author_id
    GROUP BY
      temp.author_id
    ORDER BY
      temp.author_id asc`;
    result["totalEarnings"] = totalEarningsData[0].temp_all_sale;
    for (let i = 0; i < globals_1.BOOK_TYPES.length; i++) {
        const bookType = globals_1.BOOK_TYPES[i];
        const royaltySummaryData = await prisma.$queryRaw `SELECT CASE WHEN MONTH(temp_ord_dt)>=4 THEN
      concat('FY ', YEAR(temp_ord_dt), '-',YEAR(temp_ord_dt)+1) 
      ELSE concat('FY ', (YEAR(temp_ord_dt)-1), '-',YEAR(temp_ord_dt)) END AS year_name, 
      temp.author_id, author_tbl.author_name, 
      sum(temp.pustaka_earnings) pustaka_sale, 
      sum(temp.amazon_earnings) amazon_sale, 
      sum(temp.scribd_earnings) scribd_sale, 
      sum(temp.kobo_earnings) kobo_sale, 
      sum(temp.google_earnings) google_sale, 
      sum(temp.overdrive_earnings) overdrive_sale, 
      sum(temp.storytel_earnings) storytel_sale, 
      sum(temp.audible_earnings) audible_sale,	
      sum(temp.pustaka_earnings)+sum(temp.amazon_earnings)+sum(temp.scribd_earnings)+sum(temp.kobo_earnings)+sum(temp.google_earnings)+sum(temp.overdrive_earnings)+sum(temp.storytel_earnings)+sum(temp.audible_earnings) temp_all_sale, 
      DATE_FORMAT(temp.temp_ord_dt, '%M %Y') ord_dt 
      FROM 
      (
      SELECT author_id, (converted_book_final_royalty_value_inr+book_final_royalty_value_inr) as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, order_date temp_ord_dt FROM author_transaction where author_id=${authorId} and order_date>=${fyStartDate} and order_date<=${fyEndDate} 
      UNION ALL 
        SELECT author_id, 0 as pustaka_earnings, final_royalty_value as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, invoice_date temp_ord_dt FROM amazon_transactions where author_id=${authorId} and invoice_date>=${fyStartDate} and invoice_date<=${fyEndDate} 
      UNION ALL 
        SELECT author_id, 0 as pustaka_earnings, 0 as amazon_earnings, converted_inr as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, payout_month temp_ord_dt from scribd_transaction where author_id=${authorId} and payout_month>=${fyStartDate} and payout_month<=${fyEndDate} 
      UNION ALL 
        SELECT author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, paid_inr as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, transaction_date temp_ord_dt FROM kobo_transaction where author_id=${authorId} and transaction_date>=${fyStartDate} and transaction_date<=${fyEndDate} 
      UNION ALL 
        select author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, final_royalty_value as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, earnings_date temp_ord_dt FROM google_transactions where author_id=${authorId} and earnings_date>=${fyStartDate} and earnings_date<=${fyEndDate} 
      UNION ALL 
        select author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, final_royalty_value as overdrive_earnings, 0 as storytel_earnings, 0 as audible_earnings, transaction_date temp_ord_dt FROM overdrive_transactions where author_id=${authorId} and transaction_date>=${fyStartDate} and transaction_date<=${fyEndDate}   
      UNION ALL 
        select author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, final_royalty_value as storytel_earnings, 0 as audible_earnings, transaction_date temp_ord_dt FROM storytel_transactions where author_id=${authorId} and transaction_date>=${fyStartDate} and transaction_date<=${fyEndDate} 
      UNION ALL 
        select author_id, 0 as pustaka_earnings, 0 as amazon_earnings, 0 as scribd_earnings, 0 as kobo_earnings, 0 as google_earnings, 0 as overdrive_earnings, 0 as storytel_earnings, final_royalty_value as audible_earnings, transaction_date temp_ord_dt FROM audible_transactions where author_id=${authorId} and transaction_date>=${fyStartDate} and transaction_date<=${fyEndDate} 
      ) temp, 
      author_tbl
      WHERE author_tbl.author_id=temp.author_id
      GROUP BY author_id, year_name 
      ORDER BY author_id, temp.temp_ord_dt asc`;
        result["royaltySummary"][bookType.name] = royaltySummaryData;
    }
    res.json(result);
};
exports.getRoyaltySummaryData = getRoyaltySummaryData;
//# sourceMappingURL=royalty.js.map