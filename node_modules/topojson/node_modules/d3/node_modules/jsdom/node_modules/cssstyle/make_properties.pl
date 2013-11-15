#!/usr/bin/perl -w

use strict;

while(<>) {
  chomp;
  s/^\s*//;
  my $prop = substr($_, 0, -3);  # zoom: {
  my $desc = <>;                 #     set: function (v) {
  $desc .= <>;                   #         this.setProperty('zoom', v);
  $desc .= <>;                   #     },
  $desc .= <>;                   #     get: function () {
  $desc .= <>;                   #         return this.getPropertyValue('zoom');
  $desc .= <>;                   #     },
  $desc .= <>;                   #     enumerable: true
  $desc .= <>;                   # }
  $desc =~ s/^        //gm;
  $desc =~ s/},$/}/;
  chomp $desc;
  $desc .= ";\n";
  print $prop, "\n";

  open(my $fh, ">./lib/properties/$prop.js") || die "Couldn't open $prop.js";
  print $fh "'use strict';\n\nmodule.exports = {\n", $desc;
  close $fh;
}
