package de.grubermi.code_critters.spring;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class RequestLoggingFilter implements Filter {

    private final Logger logger = LogManager.getLogger(RequestLoggingFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        if(httpRequest.getMethod().equals("POST")){
            logger.info(httpRequest.getMethod() + ":" + httpRequest.getRequestURI());
        } else {
            logger.debug(httpRequest.getMethod() + ":" + httpRequest.getRequestURI());
        }
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }
}
