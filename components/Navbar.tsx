"use client"

import * as React from "react"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import Link from "next/link"

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Medication Schedule", href: "/medications" },
  { name: "Medicines", href: "/medicines" },
  { name: "Patients", href: "/patients" },
]

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div id="top-navbar" className="sticky top-0 flex h-fit w-full p-3 bg-background border-b">
        <div className="pt-2 pr-2">
          <Image
            src="/MugPee-logo-transparent_horizon.png"
            width={100}
            height={20}
            alt="MugPee"
          />
        </div>
      </div>
    )
  }

  return (
    <div id="top-navbar" className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        {/*<div className="flex items-center">
          <Image
            src="/MugPee-logo-transparent_horizon.png"
            width={100}
            height={20}
            alt="MugPee"
            className="h-5 w-auto"
          />
        </div>*/}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-2">
              {navigationLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link href={link.href} className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              id="dark-light-mode"
              checked={resolvedTheme === "dark"}
              onCheckedChange={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            />
            <Moon className="h-4 w-4" />
          </div>
          <Button size="sm">Download</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  id="dark-light-mode-mobile"
                  checked={resolvedTheme === "dark"}
                  onCheckedChange={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                />
                <Moon className="h-4 w-4" />
              </div>
              <Button size="sm">Download</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
