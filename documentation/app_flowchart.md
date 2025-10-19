flowchart TD
    start[Start] --> landing[Landing Page]
    landing[Landing Page] --> signin[Sign In]
    landing[Landing Page] --> signup[Sign Up]
    signin[Sign In] --> auth{Authenticated}
    signup[Sign Up] --> auth{Authenticated}
    auth{Authenticated} -->|Yes| dashboard[Dashboard]
    auth{Authenticated} -->|No| signin[Sign In]
    dashboard[Dashboard] --> chat[Open Chat]
    dashboard[Dashboard] --> profile[Profile]
    dashboard[Dashboard] --> signout[Sign Out]
    chat[Open Chat] --> api[API Chat Endpoint]
    api[API Chat Endpoint] --> llm[LLM Service]
    llm[LLM Service] --> response[Stream Response]
    response[Stream Response] --> chat[Open Chat]
    signout[Sign Out] --> landing[Landing Page]