"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  CSSProperties,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { div } from "framer-motion/client";
import Phone from "./Phone";
const PHONES = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];
function splitArray<T>(phones: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];
  for (let i = 0; i < phones.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(phones[i]);
  }
  return result;
}
function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: string[];
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  console.log(
    "reviews",
    reviews,
    "className",
    className,
    "reviewClassName",
    reviewClassName,
    "msPerPixel",
    msPerPixel,
  );

  const columnRef = useRef<HTMLDivElement | null>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  const duration = `${columnHeight * msPerPixel}ms`;
  useEffect(() => {
    if (!columnRef.current) return;
    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });
    resizeObserver.observe(columnRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as CSSProperties}
    >
      {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
        <Review
          key={reviewIndex}
          className={reviewClassName?.(reviewIndex % reviews.length)}
          imgSrc={imgSrc}
        />
      ))}
    </div>
  );
}
interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}
function Review({ imgSrc, className, ...props }: ReviewProps) {
  const POSSIBLE_ANIMATION_DELAYS = [
    "0",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];
  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
    ];
  return (
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900*/5",
        className,
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
}
function ReviewGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const columns = splitArray<string>(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  // const column3 = columns[2];
  //
  const column3 = splitArray(columns[2], 2);
  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView ? (
        <>
          {/* 根据屏幕尺寸决定每列要显示的东西 如果只能显示一列就把所有内容全展示在一列 如果只能展示两列就在第二列上加上第三列的内容 */}
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              cn({
                "md:hidden": reviewIndex >= column1.length + column3.length,
                "lg:hidden": reviewIndex > column1.length,
              })
            }
            msPerPixel={10}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= 2 ? "lg:hidden" : ""
            }
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={[...column3.flat()]}
            reviewClassName={(reviewIndex) =>
              reviewIndex >= 2 ? "lg:hidden" : ""
            }
            msPerPixel={10}
          />
        </>
      ) : null}
      {/* 创造两个渐变遮罩层 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100" />
    </div>
  );
}
export function Reviews() {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <img
        aria-hidden="true"
        src="/what-people-are-buying.png"
        className="absolute select-none hidden xl:block -left-32 top-1/3"
      />
      <ReviewGrid />
    </MaxWidthWrapper>
  );
}
