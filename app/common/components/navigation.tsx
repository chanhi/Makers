import { Separator } from "~/common/components/ui/separator";
import { Link } from "react-router";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";

const menus = [
    {
        name:"Product",
        to:"/product",
        items: [
            {
                name: "Leaderboards",
                description: "See the top performers in your community",
                to: "/product/leaderboards",
            },
            {
                name: "Categories",
                description: "Explore different categories and find your interest",
                to: "/product/categories",
            },
            {
                name: "Search",
                description: "Find exactly what you're looking for",
                to: "/product/search",
            },
            {
                name: "Submit a Product",
                description: "Contribute by submitting your own products",
                to: "/product/submit",
            },
            {
                name: "Promote",
                description: "Boost your product's visibility",
                to: "/product/promote",
            }
        ]
    },
    {
        name: "Jobs",
        to: "/jobs",
        items: [
            {
                name: "Remote Jobs",
                description: "Find a remote job in our community",
                to: "/jobs?location=remote",
            },
            {
                name: "Full-Time Jobs",
                description: "Find a full-time job in our community",
                to: "/jobs?type=full-time",
            },
            {
                name: "Freelance Jobs",
                description: "Find a freelance job in our community",
                to: "/jobs?type=freelance",
            },
            {
                name: "Internships",
                description: "Find an internship in our community",
                to: "/jobs?type=internship",
            },
            {
                name: "Submit a Job",
                description: "Submit a job to our community",
                to: "/jobs/submit",
            },
        ],
    },
    {
        name: "Community",
        to: "/community",
        items: [
            {
                name: "All Posts",
                description: "See all posts in our community",
                to: "/community",
            },
            {
                name: "Top Posts",
                description: "See the top posts in our community",
                to: "/community?sort=top",
            },
            {
                name: "New Posts",
                description: "See the new posts in our community",
                to: "/community?sort=new",
            },
            {
                name: "Create a Post",
                description: "Create a post in our community",
                to: "/community/create",
            },
        ],
    },
    {
        name: "IdeasGPT",
        to: "/ideas",
    },
    {
        name: "Teams",
        to: "/teams",
        items: [
            {
                name: "All Teams",
                description: "See all teams in our community",
                to: "/teams",
            },
            {
                name: "Create a Team",
                description: "Create a team in our community",
                to: "/teams/create",
            },
        ],
    },
];

export default function Navigation() {
    return (
        <nav className="flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
            <div className="flex items-center">
                <Link to="/" className="font-bold tracking-tighter text-lg">WeMake</Link>
                <div className="h-6">
                    <Separator orientation="vertical" className="mx-4" />
                </div>
                <NavigationMenu>
                    <NavigationMenuList>
                        {menus.map((menu) => (
                            <NavigationMenuItem key={menu.name}>
                                <NavigationMenuTrigger>
                                    {menu.name}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    {menu.items?.map((item) => (
                                        <NavigationMenuItem key={item.name}>
                                            <Link to={item.to}>{item.name}</Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ))} 
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </nav>
    );
}