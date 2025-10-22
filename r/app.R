library(shiny)

source("shinyreact.R", local = TRUE)

server <- function(input, output, session) {
  # Calculate line count from code content
  output$line_count <- render_json({
    code <- input$code_content
    if (is.null(code) || code == "") {
      return(0)
    }

    # Count lines by splitting on newlines
    lines <- strsplit(code, "\n")[[1]]
    length(lines)
  })

  # Calculate character count from code content
  output$char_count <- render_json({
    code <- input$code_content
    if (is.null(code) || code == "") {
      return(0)
    }

    nchar(code)
  })

  # Calculate word count from code content
  output$word_count <- render_json({
    code <- input$code_content
    if (is.null(code) || code == "") {
      return(0)
    }

    # Count words by splitting on whitespace
    words <- strsplit(code, "\\s+")[[1]]
    words <- words[nchar(words) > 0]
    length(words)
  })

  output$editor_content <- render_json({
    input$code_content
  })

  # Separate outputs for UI display
  output$cursor_position <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    list(
      line = ctx$line,
      column = ctx$column,
      language = ctx$language
    )
  })

  output$current_selections <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    ctx$selections
  })

  output$context_prefix <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    ctx$prefix
  })

  output$context_suffix <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    ctx$suffix
  })

  output$recent_edits_server <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    ctx$recentEdits
  })

  # Process cursor context for LLM autocomplete
  output$cursor_info <- render_json({
    ctx <- input$cursor_context

    if (is.null(ctx)) {
      return("Waiting for cursor context...")
    }

    # Format cursor information
    info_parts <- c(
      "Cursor Position:",
      paste0("  Line: ", ctx$line),
      paste0("  Column: ", ctx$column),
      paste0("  Language: ", ctx$language)
    )

    # Add selection information
    if (!is.null(ctx$selections) && length(ctx$selections) > 0) {
      info_parts <- c(
        info_parts,
        "",
        "Current Selection(s):",
        paste0("  Total selections: ", length(ctx$selections))
      )

      for (i in seq_along(ctx$selections)) {
        sel <- ctx$selections[[i]]
        has_text <- nchar(sel$text) > 0

        if (has_text) {
          info_parts <- c(
            info_parts,
            paste0("  Selection ", i, ":"),
            paste0("    Range: Line ", sel$fromLine, ":", sel$fromColumn,
                   " → Line ", sel$toLine, ":", sel$toColumn),
            paste0("    Positions: ", sel$from, "-", sel$to),
            paste0("    Text: \"", substr(sel$text, 1, 100), "\"")
          )
        } else {
          info_parts <- c(
            info_parts,
            paste0("  Selection ", i, ": (cursor only at Line ",
                   sel$fromLine, ":", sel$fromColumn, ")")
          )
        }
      }
    }

    info_parts <- c(
      info_parts,
      "",
      "Context:",
      "==============",
      ctx$prefix,
      "-- [CURSOR] --",
      ctx$suffix,
      "=============="
    )

    # Add recent edits information
    if (!is.null(ctx$recentEdits) && length(ctx$recentEdits) > 0) {
      info_parts <- c(
        info_parts,
        "",
        "Recent Edits:",
        paste0("  Total edits tracked: ", length(ctx$recentEdits))
      )

      # Show last 3 edits
      num_to_show <- min(3, length(ctx$recentEdits))
      for (i in seq_len(num_to_show)) {
        edit <- ctx$recentEdits[[length(ctx$recentEdits) - num_to_show + i]]
        info_parts <- c(
          info_parts,
          paste0("  Edit ", i, ": pos ", edit$from, "-", edit$to)
        )
        if (nchar(edit$remove) > 0) {
          info_parts <- c(
            info_parts,
            paste0("    Removed: \"", substr(edit$remove, 1, 50), "\"")
          )
        }
        if (nchar(edit$insert) > 0) {
          info_parts <- c(
            info_parts,
            paste0("    Inserted: \"", substr(edit$insert, 1, 50), "\"")
          )
        }
      }
    }

    paste(info_parts, collapse = "\n")
  })
}

shinyApp(ui = page_react(title = "Shiny Code Editor"), server = server)
