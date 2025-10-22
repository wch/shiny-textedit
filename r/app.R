library(shiny)

source("shinyreact.R", local = TRUE)

# Helper function to strip HTML tags for counting
strip_html <- function(html_text) {
  # Remove HTML tags
  text <- gsub("<[^>]+>", " ", html_text)
  # Convert HTML entities
  text <- gsub("&nbsp;", " ", text)
  text <- gsub("&amp;", "&", text)
  text <- gsub("&lt;", "<", text)
  text <- gsub("&gt;", ">", text)
  # Clean up extra whitespace
  text <- gsub("\\s+", " ", text)
  text <- trimws(text)
  return(text)
}

server <- function(input, output, session) {
  # Calculate word count from editor content
  output$word_count <- render_json({
    content <- input$editor_content
    if (is.null(content) || content == "") {
      return(0)
    }

    plain_text <- strip_html(content)
    if (plain_text == "") {
      return(0)
    }

    # Count words
    words <- strsplit(plain_text, "\\s+")[[1]]
    words <- words[nchar(words) > 0]
    length(words)
  })

  # Calculate character count from editor content
  output$char_count <- render_json({
    content <- input$editor_content
    if (is.null(content) || content == "") {
      return(0)
    }

    plain_text <- strip_html(content)
    nchar(plain_text)
  })
}

shinyApp(ui = page_react(title = "Shiny Text Editor"), server = server)
