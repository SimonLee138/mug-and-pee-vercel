"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Medication Schedule", href: "/medications" },
  { name: "Medicines", href: "/medicines" },
  { name: "Cats", href: "/cats" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <div id="top-navbar" className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="flex h-16 items-center justify-end px-4 md:px-6">
        {/* Desktop Navigation */}
        <div className="mr-auto hidden items-center md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-1">
              {navigationLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary">
                      {link.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t bg-background md:hidden">
          <nav aria-label="Mobile navigation" className="space-y-2 px-4 py-4">
            {/* Mobile Navigation Links */}
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
