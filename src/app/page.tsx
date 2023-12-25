import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "Instant delivery",
    icon: ArrowDownToLine,
    description: "Get your assests delivered to youe email in seconds and download right away"
  },
  {
    name: "Guaranteee Quality",
    icon: CheckCircle,
    description: "Ensure quality standards. Not happy? we offer 30-day refund guarantee period"
  },
  {
    name: "For the Planet",
    icon: Leaf,
    description: "We've pledged one percent of sales to preservation and restoration of the natural enviroment period"
  },
]

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Your markeplace for high quality <span className="text-blue-600">digital assets</span>.</h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">Welcome to DigitalHippo. every assest on our platform is verified by our team to ensure quality standards</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href='/products' className={buttonVariants()}>Browse Trending</Link>
            <Button variant="ghost">Our quality promise &rarr;</Button>
          </div>
        </div>

        {/* Todo: List products */}
        <ProductReel query={{sort: 'desc', limit:4}} href="/products" title="Brand New"/>
      </MaxWidthWrapper>

      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div key={perk.name} className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    {<perk.icon className="h-1/3 w-1/3" />}

                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-500">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground"> {perk.description}</p>
                </div>
              </div>
            ))}

          </div>
        </MaxWidthWrapper>

      </section>
    </>
  )
}
