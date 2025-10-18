# EduEcho Components Guide

Complete guide to all shadcn components used in EduEcho and how to use them.

## Installed Components (35+)

### Navigation Components

#### Navigation Menu
**Usage:** Main navigation bar
```tsx
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuItem>
    <NavigationMenuLink href="/threads">Threads</NavigationMenuLink>
  </NavigationMenuItem>
</NavigationMenu>
```

#### Sidebar
**Usage:** Mobile navigation drawer
```tsx
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar"
```

#### Breadcrumb
**Usage:** Thread navigation, page hierarchy
```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/threads">Threads</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

#### Menubar
**Usage:** Application-level menu
```tsx
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent } from "@/components/ui/menubar"
```

### Content Display Components

#### Card
**Usage:** Primary content container for threads, notebooks, user profiles
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Thread Title</CardTitle>
    <CardDescription>Description here</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

#### Avatar
**Usage:** User profile images
```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### Badge
**Usage:** Tags, scores, status indicators, user types
```tsx
import { Badge } from "@/components/ui/badge"

<Badge>QuickLearner</Badge>
<Badge variant="secondary">AI Score: 8.5</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

**Variants:** default, secondary, destructive, outline

#### Accordion
**Usage:** FAQ, collapsible thread details
```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes, it follows WAI-ARIA guidelines</AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Tabs
**Usage:** View switching (threads, notebooks, leaderboard)
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="trending">
  <TabsList>
    <TabsTrigger value="trending">Trending</TabsTrigger>
    <TabsTrigger value="recent">Recent</TabsTrigger>
  </TabsList>
  <TabsContent value="trending">Trending threads</TabsContent>
  <TabsContent value="recent">Recent threads</TabsContent>
</Tabs>
```

#### Carousel
**Usage:** Featured content showcase, image galleries
```tsx
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Form Components

#### Input
**Usage:** Text input fields, search bars
```tsx
import { Input } from "@/components/ui/input"

<Input type="text" placeholder="Search..." />
<Input type="email" placeholder="Email" />
```

#### Textarea
**Usage:** Multi-line text input for questions/replies
```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Write your answer..." rows={5} />
```

#### Select
**Usage:** Dropdowns for language, categories, subjects
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select subject" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="cs">Computer Science</SelectItem>
    <SelectItem value="math">Mathematics</SelectItem>
  </SelectContent>
</Select>
```

#### Checkbox
**Usage:** Multi-select filters, preferences
```tsx
import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="terms" />
<label htmlFor="terms">Accept terms</label>
```

#### Radio Group
**Usage:** User type selection, single choice options
```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

<RadioGroup defaultValue="average">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="quick" id="quick" />
    <Label htmlFor="quick">Quick Learner</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="average" id="average" />
    <Label htmlFor="average">Average</Label>
  </div>
</RadioGroup>
```

#### Switch
**Usage:** Settings toggles, feature enable/disable
```tsx
import { Switch } from "@/components/ui/switch"

<Switch id="notifications" />
<label htmlFor="notifications">Enable notifications</label>
```

#### Slider
**Usage:** Volume control, difficulty selection, progress
```tsx
import { Slider } from "@/components/ui/slider"

<Slider defaultValue={[50]} max={100} step={1} />
```

### Interactive Components

#### Button
**Usage:** Primary actions, navigation, form submissions
```tsx
import { Button } from "@/components/ui/button"

<Button>Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Variants:** default, destructive, outline, secondary, ghost, link
**Sizes:** default, sm, lg, icon

#### Dialog
**Usage:** Modal dialogs, confirmations, forms
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

#### Sheet
**Usage:** Side panels for filters, settings, mobile menus
```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Filters</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    {/* Filter content */}
  </SheetContent>
</Sheet>
```

**Sides:** left, right, top, bottom

#### Popover
**Usage:** Quick action menus, tooltips with actions
```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>Content here</PopoverContent>
</Popover>
```

#### Dropdown Menu
**Usage:** User menus, context actions
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Context Menu
**Usage:** Right-click actions on threads, replies
```tsx
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"

<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

#### Command
**Usage:** Search command palette (⌘K)
```tsx
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandItem>Threads</CommandItem>
    <CommandItem>Notebooks</CommandItem>
  </CommandList>
</Command>
```

### Data Presentation Components

#### Table
**Usage:** Leaderboards, analytics, data grids
```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Rank</TableHead>
      <TableHead>User</TableHead>
      <TableHead>Points</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>1</TableCell>
      <TableCell>John Doe</TableCell>
      <TableCell>1250</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Progress
**Usage:** Loading states, upload progress, user progress
```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={60} />
```

#### Skeleton
**Usage:** Loading placeholders, shimmer effects
```tsx
import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-full" />
<Skeleton className="h-32 w-full rounded-lg" />
```

#### Scroll Area
**Usage:** Long content with custom scrollbars
```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-72 w-full">
  {/* Long content */}
</ScrollArea>
```

#### Calendar
**Usage:** Study scheduling, date selection
```tsx
import { Calendar } from "@/components/ui/calendar"

const [date, setDate] = useState<Date | undefined>(new Date())

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>
```

### Feedback Components

#### Sonner (Toast)
**Usage:** Notifications, alerts, success/error messages
```tsx
import { toast } from "sonner"

// Success
toast.success("Reply posted successfully!")

// Error
toast.error("Failed to upload audio")

// Info
toast.info("New reply received")

// Promise
toast.promise(
  fetchData(),
  {
    loading: 'Loading...',
    success: 'Data loaded!',
    error: 'Failed to load'
  }
)
```

#### Alert
**Usage:** Important messages, warnings
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Your session will expire soon</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Failed to save changes</AlertDescription>
</Alert>
```

**Variants:** default, destructive

#### Tooltip
**Usage:** Helpful hints on hover
```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Helpful information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### Hover Card
**Usage:** User preview cards, rich tooltips
```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

<HoverCard>
  <HoverCardTrigger>@username</HoverCardTrigger>
  <HoverCardContent>
    <div className="space-y-2">
      <h4>Username</h4>
      <p>Bio information...</p>
    </div>
  </HoverCardContent>
</HoverCard>
```

### Utility Components

#### Separator
**Usage:** Visual content dividers
```tsx
import { Separator } from "@/components/ui/separator"

<Separator />
<Separator orientation="vertical" />
```

#### Toggle
**Usage:** Binary options, view toggles
```tsx
import { Toggle } from "@/components/ui/toggle"

<Toggle>Bold</Toggle>
<Toggle variant="outline">Italic</Toggle>
```

#### Toggle Group
**Usage:** Related toggle options, view mode selection
```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

<ToggleGroup type="single">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
```

#### Resizable
**Usage:** Adjustable panels, split views
```tsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>Panel 1</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>Panel 2</ResizablePanel>
</ResizablePanelGroup>
```

## Component Combinations

### Thread Card
```tsx
<Card>
  <CardHeader>
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle>{thread.question}</CardTitle>
        <CardDescription>{thread.description}</CardDescription>
        <div className="flex gap-2 mt-2">
          {thread.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
        </div>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>{thread.replyCount} replies</span>
      <span>{thread.upvotes} upvotes</span>
      <Badge>AI Score: {thread.avgScore}</Badge>
    </div>
  </CardContent>
</Card>
```

### Search Command Palette
```tsx
<Command>
  <CommandInput placeholder="Search threads, notebooks..." />
  <CommandList>
    <CommandGroup heading="Threads">
      <CommandItem>How do B+ Trees work?</CommandItem>
    </CommandGroup>
    <CommandGroup heading="Notebooks">
      <CommandItem>Data Structures Notes</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### User Menu
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar>
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>
      <div>
        <p>{user.name}</p>
        <Badge variant="secondary">{user.type}</Badge>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Notebooks</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Best Practices

1. **Accessibility:** All components are accessible by default with ARIA labels
2. **Responsive:** Components adapt to mobile/tablet/desktop
3. **Theming:** Use CSS variables for consistent styling
4. **Composition:** Combine components for complex UIs
5. **Performance:** Use lazy loading for heavy components

## Customization

All components can be customized via className:

```tsx
<Button className="bg-gradient-to-r from-purple-500 to-pink-500">
  Custom Gradient
</Button>

<Card className="border-2 border-primary hover:shadow-2xl transition-all">
  Custom Card
</Card>
```

## Documentation Links

- shadcn/ui: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com
- Tailwind CSS: https://tailwindcss.com
