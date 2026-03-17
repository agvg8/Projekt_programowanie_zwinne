package com.project.controller;

import com.project.model.Zadanie;
import com.project.service.ZadanieService;
import com.project.service.ProjektService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class ZadanieController {
    private final ZadanieService zadanieService;
    private final ProjektService projektService;

    public ZadanieController(ZadanieService zadanieService, ProjektService projektService) {
        this.zadanieService = zadanieService;
        this.projektService = projektService;
    }

    @GetMapping("/zadanieList")
    public String zadanieList(Model model, Pageable pageable) {
        model.addAttribute("zadania", zadanieService.getZadania(pageable).getContent());
        return "zadanieList";
    }

    @GetMapping("/zadanieEdit")
    public String zadanieEdit(@RequestParam(name="zadanieId", required = false) Integer zadanieId, Model model) {
        if(zadanieId != null) {
            model.addAttribute("zadanie", zadanieService.getZadanie(zadanieId).orElse(new Zadanie()));
        } else {
            model.addAttribute("zadanie", new Zadanie());
        }
        model.addAttribute("projekty", projektService.getProjekty(Pageable.unpaged()).getContent());
        return "zadanieEdit";
    }

    @PostMapping("/zadanieEdit")
    public String zadanieSave(@ModelAttribute @Valid Zadanie zadanie, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) return "zadanieEdit";
        zadanieService.setZadanie(zadanie);
        return "redirect:/zadanieList";
    }
}