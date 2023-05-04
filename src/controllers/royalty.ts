import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { BOOK_TYPES, PAPERBACK_BOOK_TYPES } from "../utils/globals";
import getMonthsForFy, { parseMonthString } from "../utils/getMonthsForFy";

const prisma = new PrismaClient({
  // log: ["query"],
});

export const getRoyaltySummaryData = async (req: Request, res: Response) => {
  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);
  const typeId = parseInt(req.body.typeId);
  const type = req.body.type;

  const result: any = {};
  const royaltySummary: any = {};

  let dates: any = {};
  if (type === "year") {
    dates = await prisma.site_config.findMany({
      where: {
        category: {
          equals: "FY",
        },
      },
    });
  } else {
    const fyYearKey = req.body.fyYearKey;
    dates = await getMonthsForFy(fyYearKey);
  }

  let bookType: any = {};
  if (typeId === 1) {
    bookType = BOOK_TYPES[0];
  } else {
    bookType = BOOK_TYPES[1];
  }

  // Initializing variables

  for (let i = 0; i < dates.length; i++) {
    const fyData = dates[i];
    const fyDates: string[] = fyData.value.split(",");
    const startDate = new Date(fyDates[0]);
    const endDateOld = new Date(fyDates[1]);
    const endDate = new Date(
      endDateOld.getTime() + Math.abs(endDateOld.getTimezoneOffset() * 60000)
    );

    const channelData: any = {};
    channelData["total"] = 0;

    let channelDataOrder: any = {};
    if (typeId === 1) {
      channelDataOrder = {
        pustaka: null,
        amazon: null,
        scribd: null,
        google: null,
        storytel: null,
        overdrive: null,
        kobo: null,
        total: null,
      };
    } else if (typeId === 3) {
      channelDataOrder = {
        pustaka: null,
        audible: null,
        google: null,
        storytel: null,
        overdrive: null,
        total: null,
      };
    } else if (typeId === 4) {
      channelDataOrder = {
        pustakaOnlineWhatsapp: null,
        pustakaBookFair: null,
        amazon: null,
        total: null,
      };
    }

    // Not Paperback
    if (typeId !== 4) {
      // Pustaka
      {
        const pustakaEarnings = await prisma.author_transaction.aggregate({
          _sum: {
            book_final_royalty_value_inr: true,
            converted_book_final_royalty_value_inr: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            order_date: {
              gte: startDate,
              lte: endDate,
            },
            order_type: {
              in:
                bookType.id === 1
                  ? ["1", "2", "3"]
                  : bookType.id === 3
                  ? ["4", "5", "6", "8"]
                  : ["7", "9", "10", "11", "12"],
            },
          },
        });

        channelData["pustaka"] =
          (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
          (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
        channelData["total"] +=
          (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
          (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
      }

      // Amazon / Audible
      {
        const amazonEarnings = await prisma.amazon_transactions.aggregate({
          _sum: {
            final_royalty_value: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            invoice_date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        if (bookType.id === 1) {
          channelData["amazon"] = amazonEarnings._sum.final_royalty_value;
          channelData["total"] += amazonEarnings._sum.final_royalty_value;
        } else {
          const audibleEarnings = await prisma.audible_transactions.aggregate({
            _sum: {
              final_royalty_value: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              transaction_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });

          channelData["audible"] = audibleEarnings._sum.final_royalty_value;
          channelData["total"] += audibleEarnings._sum.final_royalty_value;
        }
      }

      // Scribd / Kobo
      {
        if (bookType.id === 1) {
          const scribdEarnings = await prisma.scribd_transaction.aggregate({
            _sum: {
              converted_inr: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              Payout_month: {
                gte: startDate,
                lte: endDate,
              },
            },
          });

          channelData["scribd"] = scribdEarnings._sum.converted_inr;
          channelData["total"] += scribdEarnings._sum.converted_inr;

          const koboEarnings = await prisma.kobo_transaction.aggregate({
            _sum: {
              paid_inr: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              transaction_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });

          channelData["kobo"] = koboEarnings._sum.paid_inr;
          channelData["total"] += koboEarnings._sum.paid_inr;
        }
      }

      // Google Books
      {
        const googleEarnings = await prisma.google_transactions.aggregate({
          _sum: {
            final_royalty_value: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            transaction_date: {
              gte: startDate,
              lte: endDate,
            },
            type_of_book: bookType.id,
          },
        });

        channelData["google"] = googleEarnings._sum.final_royalty_value;
        channelData["total"] += googleEarnings._sum.final_royalty_value;
      }

      // Storytel
      {
        const storytelEarnings = await prisma.storytel_transactions.aggregate({
          _sum: {
            final_royalty_value: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            transaction_date: {
              gte: startDate,
              lte: endDate,
            },
            type_of_book: bookType.id,
          },
        });

        channelData["storytel"] = storytelEarnings._sum.final_royalty_value;
        channelData["total"] += storytelEarnings._sum.final_royalty_value;
      }

      // Overdrive
      {
        const overdriveEarnings = await prisma.overdrive_transactions.aggregate(
          {
            _sum: {
              final_royalty_value: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              transaction_date: {
                gte: startDate,
                lte: endDate,
              },
              type_of_book: bookType.id,
            },
          }
        );

        channelData["overdrive"] = overdriveEarnings._sum.final_royalty_value;
        channelData["total"] += overdriveEarnings._sum.final_royalty_value;
      }

      // Showing Audiobook Data only from "FY 2020-21" (Only for FY)
      if (type === "year" && typeId === 3 && i >= 6) {
        royaltySummary[fyData.key] = Object.assign(
          channelDataOrder,
          channelData
        );
      }
      // eBook data shown for all years
      else if (type === "year" && typeId === 1) {
        royaltySummary[fyData.key] = Object.assign(
          channelDataOrder,
          channelData
        );
      } else if (type === "month") {
        royaltySummary[fyData.key] = Object.assign(
          channelDataOrder,
          channelData
        );
      }
    }
    // Paperback
    else {
      for (let k = 0; k < PAPERBACK_BOOK_TYPES.length; k++) {
        const bookTypeData = PAPERBACK_BOOK_TYPES[k];

        // All
        const paperbackEarnings = await prisma.author_transaction.aggregate({
          _sum: {
            book_final_royalty_value_inr: true,
            converted_book_final_royalty_value_inr: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            order_date: {
              gte: startDate,
              lte: endDate,
            },
            order_type: {
              in: bookTypeData.id,
            },
          },
        });

        channelData[bookTypeData.name] =
          (paperbackEarnings._sum.book_final_royalty_value_inr || 0) +
          (paperbackEarnings._sum.converted_book_final_royalty_value_inr || 0);
        channelData["total"] +=
          (paperbackEarnings._sum.book_final_royalty_value_inr || 0) +
          (paperbackEarnings._sum.converted_book_final_royalty_value_inr || 0);

        // Calculating Paperback Data only after "FY 2022-23"
        if (type === "year" && i >= 8) {
          royaltySummary[fyData.key] = Object.assign(
            channelDataOrder,
            channelData
          );
        } else if (type === "month") {
          royaltySummary[fyData.key] = Object.assign(
            channelDataOrder,
            channelData
          );
        }
      }
    }
  }

  result["data"] = royaltySummary;
  if (typeId === 1) {
    result["names"] = [
      "Pustaka",
      "Amazon",
      "Scribd",
      "Google Books",
      "Storytel",
      "Overdrive",
      "Kobo",
      "Total",
    ];
  } else if (typeId === 3) {
    result["names"] = [
      "Pustaka",
      "Audible",
      "Google Books",
      "Storytel",
      "Overdrive",
      "Total",
    ];
  } else {
    result["names"] = [
      "Pustaka (Online/Whatsapp)",
      "Pustaka (Book Fair)",
      "Amazon",
      // "Flipkart",
      // "Ingram",
      "Total",
    ];
  }

  // Calculating total earnings
  let totalEarnings = 0;
  for (const fyYear in royaltySummary) {
    totalEarnings += royaltySummary[fyYear]["total"];
  }
  result["totalEarnings"] = totalEarnings;

  res.json(result);
};

export const getAllChannelSummaryData = async (req: Request, res: Response) => {
  const authorId = req.body.authorId;
  const copyrightOwner = req.body.copyrightOwner;
  const type = req.body.type;

  const summaryData: any = {};
  const result: any = {};

  let dates: any = [];
  if (type === "year") {
    dates = await prisma.site_config.findMany({
      where: {
        category: {
          equals: "FY",
        },
      },
    });
  } else {
    const fyYearKey = req.body.fyYearKey;
    dates = await getMonthsForFy(fyYearKey);
  }

  for (let i = 0; i < dates.length; i++) {
    const channelData: any = {};
    channelData["ebooks"] = 0;
    channelData["audiobooks"] = 0;
    channelData["total"] = 0;

    const fyData = dates[i];
    const fyDates = fyData.value.split(",");
    const startDate = new Date(fyDates[0]);
    const endDateOld = new Date(fyDates[1]);
    const endDate = new Date(
      endDateOld.getTime() + Math.abs(endDateOld.getTimezoneOffset() * 60000)
    );

    for (let j = 0; j < BOOK_TYPES.length; j++) {
      const bookType = BOOK_TYPES[j];

      // Pustaka
      {
        const pustakaEarnings = await prisma.author_transaction.aggregate({
          _sum: {
            book_final_royalty_value_inr: true,
            converted_book_final_royalty_value_inr: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            order_date: {
              gte: startDate,
              lte: endDate,
            },
            order_type: {
              in: bookType.id === 1 ? ["1", "2", "3"] : ["4", "5", "6", "8"],
            },
          },
        });

        channelData[bookType.name] +=
          (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
          (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
        channelData["total"] +=
          (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
          (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
      }

      // Google Books
      {
        const googleEarnings = await prisma.google_transactions.aggregate({
          _sum: {
            final_royalty_value: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            transaction_date: {
              gte: startDate,
              lte: endDate,
            },
            type_of_book: bookType.id,
          },
        });

        channelData[bookType.name] += googleEarnings._sum.final_royalty_value;
        channelData["total"] += googleEarnings._sum.final_royalty_value;
      }

      // Storytel
      {
        const storytelEarnings = await prisma.storytel_transactions.aggregate({
          _sum: {
            final_royalty_value: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            transaction_date: {
              gte: startDate,
              lte: endDate,
            },
            type_of_book: bookType.id,
          },
        });

        channelData[bookType.name] += storytelEarnings._sum.final_royalty_value;
        channelData["total"] += storytelEarnings._sum.final_royalty_value;
      }

      // Overdrive
      {
        const overdriveEarnings = await prisma.overdrive_transactions.aggregate(
          {
            _sum: {
              final_royalty_value: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              transaction_date: {
                gte: startDate,
                lte: endDate,
              },
              type_of_book: bookType.id,
            },
          }
        );

        channelData[bookType.name] +=
          overdriveEarnings._sum.final_royalty_value;
        channelData["total"] += overdriveEarnings._sum.final_royalty_value;
      }

      // Only eBook Channels
      if (bookType.id !== 3) {
        // Amazon
        {
          const amazonEarnings = await prisma.amazon_transactions.aggregate({
            _sum: {
              final_royalty_value: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              invoice_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });

          channelData[bookType.name] += amazonEarnings._sum.final_royalty_value;
          channelData["total"] += amazonEarnings._sum.final_royalty_value;
        }

        // Scribd
        {
          const scribdEarnings = await prisma.scribd_transaction.aggregate({
            _sum: {
              converted_inr: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              Payout_month: {
                gte: startDate,
                lte: endDate,
              },
            },
          });

          channelData[bookType.name] += scribdEarnings._sum.converted_inr;
          channelData["total"] += scribdEarnings._sum.converted_inr;
        }

        // Kobo
        {
          const koboEarnings = await prisma.kobo_transaction.aggregate({
            _sum: {
              paid_inr: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              transaction_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });

          channelData[bookType.name] += koboEarnings._sum.paid_inr;
          channelData["total"] += koboEarnings._sum.paid_inr;
        }
      }
      // Only Audiobook Channels
      else {
        // Audible
        {
          const audibleEarnings = await prisma.audible_transactions.aggregate({
            _sum: {
              final_royalty_value: true,
            },
            where: {
              author_id: authorId,
              copyright_owner: copyrightOwner,
              transaction_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });

          channelData[bookType.name] +=
            audibleEarnings._sum.final_royalty_value;
          channelData["total"] += audibleEarnings._sum.final_royalty_value;
        }
      }
    }

    // Pustaka Paperback
    {
      const pustakaPaperbackEarnings =
        await prisma.author_transaction.aggregate({
          _sum: {
            book_final_royalty_value_inr: true,
            converted_book_final_royalty_value_inr: true,
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            order_date: {
              gte: startDate,
              lte: endDate,
            },
            order_type: {
              in: ["7", "9", "10", "11", "12"],
            },
          },
        });

      channelData["paperback"] =
        (pustakaPaperbackEarnings._sum.book_final_royalty_value_inr || 0) +
        (pustakaPaperbackEarnings._sum.converted_book_final_royalty_value_inr ||
          0);
      channelData["total"] +=
        (pustakaPaperbackEarnings._sum.book_final_royalty_value_inr || 0) +
        (pustakaPaperbackEarnings._sum.converted_book_final_royalty_value_inr ||
          0);
    }
    const channelDataOrder = {
      ebooks: null,
      audiobooks: null,
      paperback: null,
      total: null,
    };

    summaryData[fyData.key] = Object.assign(channelDataOrder, channelData);
  }

  result["data"] = summaryData;
  result["names"] = ["eBooks", "Audio Books", "Paperback", "Total"];

  // Calculating total earnings
  let totalEarnings = 0;
  for (const fyYear in summaryData) {
    totalEarnings += summaryData[fyYear]["total"] || 0;
  }
  result["totalEarnings"] = totalEarnings;

  res.json(result);
};

export const getPaymentsForMonth = async (req: Request, res: Response) => {
  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);
  const typeId = parseInt(req.body.typeId);
  const monthKey = req.body.monthKey;

  const result: any = {};
  const channelData: any = {};

  let bookType: any = {};
  if (typeId === 1) {
    bookType = BOOK_TYPES[0];
  } else {
    bookType = BOOK_TYPES[1];
  }
  const dateParse = await parseMonthString(monthKey);
  const fyDates = dateParse.split(",");

  const dateFormatConfig: any = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Not Paperback
  if (typeId !== 4) {
    // Pustaka
    {
      const pustakaEarnings = await prisma.author_transaction.findMany({
        select: {
          book_final_royalty_value_inr: true,
          converted_book_final_royalty_value_inr: true,
          order_date: true,
          order_type: true,
          pay_status: true,
          book: {
            select: {
              book_title: true,
              language_tbl_relation: {
                select: {
                  language_name: true,
                },
              },
            },
          },
        },
        where: {
          author_id: authorId,
          copyright_owner: copyrightOwner,
          order_date: {
            gte: new Date(fyDates[0]),
            lte: new Date(fyDates[1]),
          },
          order_type: {
            in: bookType.id === 1 ? ["1", "2", "3"] : ["4", "5", "6", "8"],
          },
        },
      });

      channelData["pustaka"] = {};
      channelData["pustaka"]["title"] = "Pustaka";
      channelData["pustaka"]["headers"] = [
        "Order Date",
        "Title",
        "Language",
        "Purchase Type",
        "Royalty",
        "Status",
      ];
      channelData["pustaka"]["totalEarnings"] = 0;
      channelData["pustaka"]["data"] = [];

      for (const dataItem of pustakaEarnings) {
        const insertItem = {
          orderDate: new Date(dataItem.order_date!).toLocaleDateString(
            "en-US",
            dateFormatConfig
          ),
          title: dataItem.book.book_title,
          language: dataItem.book.language_tbl_relation.language_name,
          purchaseType: dataItem.order_type,
          royalty: (
            dataItem.book_final_royalty_value_inr +
            dataItem.converted_book_final_royalty_value_inr
          ).toFixed(2),
          status: dataItem.pay_status === "O" ? "Pending" : "Paid",
        };

        channelData["pustaka"]["data"].push(insertItem);
        channelData["pustaka"]["totalEarnings"] += parseInt(insertItem.royalty);
      }
    }
    // Amazon / Audible
    {
      const amazonEarnings = await prisma.amazon_transactions.findMany({
        select: {
          final_royalty_value: true,
          invoice_date: true,
          units_purchased: true,
          payment_currency: true,
          status: true,
          book: {
            select: {
              book_title: true,
              language_tbl_relation: {
                select: {
                  language_name: true,
                },
              },
            },
          },
        },
        where: {
          author_id: authorId,
          copyright_owner: copyrightOwner,
          invoice_date: {
            gte: new Date(fyDates[0]),
            lte: new Date(fyDates[1]),
          },
          book: {
            type_of_book: bookType.id,
          },
        },
      });

      if (bookType.id === 1) {
        channelData["amazon"] = {};
        channelData["amazon"]["title"] = "Amazon";
        channelData["amazon"]["headers"] = [
          "Order Date",
          "Title",
          "Language",
          "Units",
          "Currency",
          "Royalty",
          "Status",
        ];
        channelData["amazon"]["totalEarnings"] = 0;
        channelData["amazon"]["data"] = [];

        for (const dataItem of amazonEarnings) {
          const insertItem = {
            orderDate: new Date(dataItem.invoice_date!).toLocaleDateString(
              "en-US",
              dateFormatConfig
            ),
            title: dataItem.book.book_title,
            language: dataItem.book.language_tbl_relation.language_name,
            units: dataItem.units_purchased,
            currency: dataItem.payment_currency,
            royalty: dataItem.final_royalty_value.toFixed(2),
            status: dataItem.status === "R" ? "Pending" : "Paid",
          };

          channelData["amazon"]["data"].push(insertItem);
          channelData["amazon"]["totalEarnings"] += parseInt(
            insertItem.royalty
          );
        }
      } else {
        const audibleEarnings = await prisma.audible_transactions.findMany({
          select: {
            final_royalty_value: true,
            transaction_date: true,
            status: true,
            book: {
              select: {
                book_title: true,
                language_tbl_relation: {
                  select: {
                    language_name: true,
                  },
                },
              },
            },
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            transaction_date: {
              gte: new Date(fyDates[0]),
              lte: new Date(fyDates[1]),
            },
            book: {
              type_of_book: bookType.id,
            },
          },
        });

        channelData["audible"] = {};
        channelData["audible"]["title"] = "Audible";
        channelData["audible"]["headers"] = [
          "Order Date",
          "Title",
          "Language",
          "Royalty",
          "Status",
        ];
        channelData["audible"]["totalEarnings"] = 0;
        channelData["audible"]["data"] = [];

        for (const dataItem of audibleEarnings) {
          const insertItem = {
            orderDate: new Date(dataItem.transaction_date!).toLocaleDateString(
              "en-US",
              dateFormatConfig
            ),
            title: dataItem.book.book_title,
            language: dataItem.book.language_tbl_relation.language_name,
            royalty: dataItem.final_royalty_value?.toFixed(2),
            status: dataItem.status === "O" ? "Pending" : "Paid",
          };

          channelData["audible"]["data"].push(insertItem);
          channelData["audible"]["totalEarnings"] += parseInt(
            insertItem.royalty!
          );
        }
      }
    }
    // Scribd
    {
      if (bookType.id === 1) {
        const scribdEarnings = await prisma.scribd_transaction.findMany({
          select: {
            converted_inr: true,
            Payout_month: true,
            status: true,
            book: {
              select: {
                book_title: true,
                language_tbl_relation: {
                  select: {
                    language_name: true,
                  },
                },
              },
            },
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            Payout_month: {
              gte: new Date(fyDates[0]),
              lte: new Date(fyDates[1]),
            },
            book: {
              type_of_book: bookType.id,
            },
          },
        });

        channelData["scribd"] = {};
        channelData["scribd"]["title"] = "Scribd";
        channelData["scribd"]["headers"] = [
          "Order Date",
          "Title",
          "Language",
          "Royalty",
          "Status",
        ];
        channelData["scribd"]["totalEarnings"] = 0;
        channelData["scribd"]["data"] = [];

        for (const dataItem of scribdEarnings) {
          const insertItem = {
            orderDate: new Date(dataItem.Payout_month!).toLocaleDateString(
              "en-US",
              dateFormatConfig
            ),
            title: dataItem.book.book_title,
            language: dataItem.book.language_tbl_relation.language_name,
            royalty: dataItem.converted_inr.toFixed(2),
            status: dataItem.status === "O" ? "Pending" : "Paid",
          };

          channelData["scribd"]["data"].push(insertItem);
          channelData["scribd"]["totalEarnings"] += parseInt(
            insertItem.royalty
          );
        }
      }
    }
    // Google Books
    {
      const googleEarnings = await prisma.google_transactions.findMany({
        select: {
          final_royalty_value: true,
          transaction_date: true,
          status: true,
          book: {
            select: {
              book_title: true,
              language_tbl_relation: {
                select: {
                  language_name: true,
                },
              },
            },
          },
        },
        where: {
          author_id: authorId,
          copyright_owner: copyrightOwner,
          transaction_date: {
            gte: new Date(fyDates[0]),
            lte: new Date(fyDates[1]),
          },
          book: {
            type_of_book: bookType.id,
          },
        },
      });

      channelData["google"] = {};
      channelData["google"]["title"] = "Google Books";
      channelData["google"]["headers"] = [
        "Order Date",
        "Title",
        "Language",
        "Royalty",
        "Status",
      ];
      channelData["google"]["totalEarnings"] = 0;
      channelData["google"]["data"] = [];

      for (const dataItem of googleEarnings) {
        const insertItem = {
          orderDate: new Date(dataItem.transaction_date!).toLocaleDateString(
            "en-US",
            dateFormatConfig
          ),
          title: dataItem.book.book_title,
          language: dataItem.book.language_tbl_relation.language_name,
          royalty: dataItem.final_royalty_value.toFixed(2),
          status: dataItem.status === "O" ? "Pending" : "Paid",
        };

        channelData["google"]["data"].push(insertItem);
        channelData["google"]["totalEarnings"] += parseInt(insertItem.royalty);
      }
    }
    // Storytel
    {
      const storytelEarnings = await prisma.storytel_transactions.findMany({
        select: {
          final_royalty_value: true,
          transaction_date: true,
          status: true,
          book: {
            select: {
              book_title: true,
              language_tbl_relation: {
                select: {
                  language_name: true,
                },
              },
            },
          },
        },
        where: {
          author_id: authorId,
          copyright_owner: copyrightOwner,
          transaction_date: {
            gte: new Date(fyDates[0]),
            lte: new Date(fyDates[1]),
          },
          book: {
            type_of_book: bookType.id,
          },
        },
      });

      channelData["storytel"] = {};
      channelData["storytel"]["title"] = "Storytel";
      channelData["storytel"]["headers"] = [
        "Order Date",
        "Title",
        "Language",
        "Royalty",
        "Status",
      ];
      channelData["storytel"]["totalEarnings"] = 0;
      channelData["storytel"]["data"] = [];

      for (const dataItem of storytelEarnings) {
        const insertItem = {
          orderDate: new Date(dataItem.transaction_date!).toLocaleDateString(
            "en-US",
            dateFormatConfig
          ),
          title: dataItem.book.book_title,
          language: dataItem.book.language_tbl_relation.language_name,
          royalty: dataItem.final_royalty_value?.toFixed(2),
          status: dataItem.status === "O" ? "Pending" : "Paid",
        };

        channelData["storytel"]["data"].push(insertItem);
        channelData["storytel"]["totalEarnings"] += parseInt(
          insertItem.royalty!
        );
      }
    }
    // Overdrive
    {
      const overdriveEarnings = await prisma.overdrive_transactions.findMany({
        select: {
          final_royalty_value: true,
          transaction_date: true,
          status: true,
          book: {
            select: {
              book_title: true,
              language_tbl_relation: {
                select: {
                  language_name: true,
                },
              },
            },
          },
        },
        where: {
          author_id: authorId,
          copyright_owner: copyrightOwner,
          transaction_date: {
            gte: new Date(fyDates[0]),
            lte: new Date(fyDates[1]),
          },
          book: {
            type_of_book: bookType.id,
          },
        },
      });

      channelData["overdrive"] = {};
      channelData["overdrive"]["title"] = "Overdrive";
      channelData["overdrive"]["headers"] = [
        "Order Date",
        "Title",
        "Language",
        "Royalty",
        "Status",
      ];
      channelData["overdrive"]["totalEarnings"] = 0;
      channelData["overdrive"]["data"] = [];

      for (const dataItem of overdriveEarnings) {
        const insertItem = {
          orderDate: new Date(dataItem.transaction_date!).toLocaleDateString(
            "en-US",
            dateFormatConfig
          ),
          title: dataItem.book.book_title,
          language: dataItem.book.language_tbl_relation.language_name,
          royalty: dataItem.final_royalty_value.toFixed(2),
          status: dataItem.status === "O" ? "Pending" : "Paid",
        };

        channelData["overdrive"]["data"].push(insertItem);
        channelData["overdrive"]["totalEarnings"] += parseInt(
          insertItem.royalty
        );
      }
    }
    // Kobo
    {
      if (bookType.id === 1) {
        const koboEarnings = await prisma.kobo_transaction.findMany({
          select: {
            paid_inr: true,
            transaction_date: true,
            status: true,
            book: {
              select: {
                book_title: true,
                language_tbl_relation: {
                  select: {
                    language_name: true,
                  },
                },
              },
            },
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            transaction_date: {
              gte: new Date(fyDates[0]),
              lte: new Date(fyDates[1]),
            },
            book: {
              type_of_book: bookType.id,
            },
          },
        });

        channelData["kobo"] = {};
        channelData["kobo"]["title"] = "Kobo";
        channelData["kobo"]["headers"] = [
          "Order Date",
          "Title",
          "Language",
          "Royalty",
          "Status",
        ];
        channelData["kobo"]["totalEarnings"] = 0;
        channelData["kobo"]["data"] = [];

        for (const dataItem of koboEarnings) {
          const insertItem = {
            orderDate: new Date(dataItem.transaction_date!).toLocaleDateString(
              "en-US",
              dateFormatConfig
            ),
            title: dataItem.book.book_title,
            language: dataItem.book.language_tbl_relation.language_name,
            royalty: dataItem.paid_inr.toFixed(2),
            status: dataItem.status === "O" ? "Pending" : "Paid",
          };

          channelData["kobo"]["data"].push(insertItem);
          channelData["kobo"]["totalEarnings"] += parseInt(insertItem.royalty);
        }
      }
    }
  }
  // Paperback
  else {
    // Pustaka Online/WhatsApp
    {
      const pustakaOnlineWhatsappEarnings =
        await prisma.author_transaction.findMany({
          select: {
            book_final_royalty_value_inr: true,
            converted_book_final_royalty_value_inr: true,
            order_date: true,
            order_type: true,
            order_id: true,
            comments: true,
            pay_status: true,
            book: {
              select: {
                book_id: true,
                book_title: true,
                language_tbl_relation: {
                  select: {
                    language_name: true,
                  },
                },
              },
            },
          },
          where: {
            author_id: authorId,
            copyright_owner: copyrightOwner,
            order_date: {
              gte: new Date(fyDates[0]),
              lte: new Date(fyDates[1]),
            },
            order_type: {
              in: ["7", "10"],
            },
          },
        });

      channelData["pustakaOnlineWhatsapp"] = {};
      channelData["pustakaOnlineWhatsapp"]["title"] =
        "Pustaka - Online/WhatsApp";
      channelData["pustakaOnlineWhatsapp"]["headers"] = [
        "Order Date",
        "Title",
        "Quantity",
        "Purchase Type",
        "Royalty",
        "Remarks",
        "Status",
      ];
      channelData["pustakaOnlineWhatsapp"]["totalEarnings"] = 0;
      channelData["pustakaOnlineWhatsapp"]["data"] = [];

      for (const dataItem of pustakaOnlineWhatsappEarnings) {
        const quantityData = await prisma.pod_order_details.findFirst({
          select: {
            quantity: true,
          },
          where: {
            order_id: dataItem.order_id,
            book_id: dataItem.book.book_id,
          },
        });

        const insertItem = {
          orderDate: new Date(dataItem.order_date!).toLocaleDateString(
            "en-US",
            dateFormatConfig
          ),
          title: dataItem.book.book_title,
          quantity: quantityData?.quantity,
          purchaseType: dataItem.order_type,
          royalty: (
            dataItem.book_final_royalty_value_inr +
            dataItem.converted_book_final_royalty_value_inr
          ).toFixed(2),
          remarks: dataItem.comments,
          status: dataItem.pay_status === "O" ? "Pending" : "Paid",
        };

        channelData["pustakaOnlineWhatsapp"]["data"].push(insertItem);
        channelData["pustakaOnlineWhatsapp"]["totalEarnings"] += parseInt(
          insertItem.royalty
        );
      }
    }

    // Pustaka Book Fair
    {
      const pustakaBookFairEarnings = await prisma.author_transaction.findMany({
        select: {
          book_final_royalty_value_inr: true,
          converted_book_final_royalty_value_inr: true,
          order_id: true,
          order_date: true,
          comments: true,
          pay_status: true,
        },
        where: {
          author_id: authorId,
          copyright_owner: copyrightOwner,
          order_date: {
            gte: new Date(fyDates[0]),
            lte: new Date(fyDates[1]),
          },
          order_type: {
            in: ["9"],
          },
        },
      });

      channelData["pustakaBookFair"] = {};
      channelData["pustakaBookFair"]["title"] = "Pustaka - Online/WhatsApp";
      channelData["pustakaBookFair"]["headers"] = [
        "Order Date",
        "Title",
        "Quantity",
        "Price",
        "Royalty",
        "Status",
      ];
      channelData["pustakaBookFair"]["totalEarnings"] = 0;
      channelData["pustakaBookFair"]["data"] = [];

      for (const dataItem of pustakaBookFairEarnings) {
        const bookData = await prisma.pod_bookfair.findMany({
          select: {
            quantity: true,
            price: true,
            final_royalty_value: true,
            book: {
              select: {
                book_title: true,
              },
            },
          },
          where: {
            order_id: dataItem.order_id,
          },
        });

        for (const bookItem of bookData) {
          const insertItem = {
            orderDate: new Date(dataItem.order_date!).toLocaleDateString(
              "en-US",
              dateFormatConfig
            ),
            title: bookItem.book.book_title,
            quantity: bookItem.quantity,
            price: bookItem.price?.toFixed(2),
            royalty: bookItem.final_royalty_value?.toFixed(2),
            status: dataItem.pay_status === "O" ? "Pending" : "Paid",
          };

          channelData["pustakaBookFair"]["data"].push(insertItem);
          channelData["pustakaBookFair"]["totalEarnings"] += parseInt(
            insertItem.royalty!
          );
        }
      }
    }
  }

  res.json(channelData);
};
