#!/usr/bin/perl
# -I /usr/lib/perl/5.6.1
# -I/home/forecast/dnmi/lib/perl5/site_perl/5.6.1/IP27-irix
#
# Extract svg-icons for use in chart
#
use strict;

sub Usage {                      
    print STDERR "
Usage: extract.pl -bg \"#fff\" -bg \"#C60000\" -fg \"#000\" [files]

Options:
    -fg <color>  Color is substituted by foreground color variable.
    -bg <color>  Color is substituded by background color variable.
    -list        List colors in files
    -v           Verbose
    -svg         Output svg-format

extract takes svg-files and creates defaults.json input...
\n";                             
    exit 1;                      
}

my @fgs=();
my @bgs=();
my @colorsB=();
my @colorsA=();
my $list=0;
my $svg=0;
my $verbose=0;
                            
## Look for options in argument list
while ($_ = $ARGV[0],/^-./) {
    shift;
    if (/^-fg$/) {push(@fgs, shift @ARGV); next;}
    if (/^-bg$/) {push(@bgs, shift @ARGV); next;}
    if (/^-list$/) {$list=1; next;}
    if (/^-v$/) {$verbose=1; next;}
    if (/^-svg$/) {$svg=1; next;}
    &Usage;
}
if (! @ARGV) {&Usage;}
#
my @files = @ARGV;
for my $file (@files) {
    if (-f $file && $file =~ m/(.*)\.svg/) {
	my $value=$1;
	my $str="";
	open(FH, '<', $file) or die $!;
	while (my $line=<FH>){
	    $str=$str . $line;
	};
	close(FH);	
	$str =~ s/\n/ /g;
	$str =~ s/<\?xml[^>]*>//g;
	#$str =~ s/<defs[^\/>]*\/>//g;
	$str =~ s/<metadata.*<\/metadata>//g;
        $str =~ s/xmlns\S*//g;
	#$str =~ s/id=\S*//g;
	$str =~ s/\s+/ /g;
	$str =~ s/height=\"[^\"]*\"/height=\"Size\"/g;
	$str =~ s/width=\"[^\"]*\"/width=\"Size\"/g;
	$str =~ s/color:\#[^;]*;/color:fg;/g;
	$str =~ s/stroke:\#[^;]*;/stroke:fg;/g;
	if (! $svg) {
	    while ($str =~ /fill:(\#[^;]*);/g) {
		push (@colorsB, $1);
	    }
	    while ($str =~ /fill="(\#[^"]*)"/g) {
		push (@colorsB, $1);
	    }
	    if (! @fgs && ! @bgs) {
		$str =~ s/fill:\#[^;]*;/fill:bg;/g;
	    } else {
		foreach my $sfg (@fgs) {
		    $str =~ s/fill:$sfg;/fill:fg;/g;
		    $str =~ s/fill="$sfg"/fill="fg"/g;
		    $str =~ s/stroke:$sfg;/stroke:fg;/g;
		    $str =~ s/stroke="$sfg"/stroke="fg"/g;
		};
		foreach my $sbg (@bgs) {
		    $str =~ s/fill:$sbg;/fill:bg;/g;
		    $str =~ s/fill="$sbg"/fill="bg"/g;
		    $str =~ s/stroke:$sbg;/stroke:bg;/g;
		    $str =~ s/stroke="$sbg"/stroke="bg"/g;
		};
	    };
	    while ($str =~ /fill:(\#[^;]*);/g) {
		push (@colorsA, $1);
	    }
	    while ($str =~ /fill="(\#[^"]*)"/g) {
		push (@colorsA, $1);
	    };
	    $str =~ s/>\s*/>/g;
	    $str =~ s/\s*</</g;
	    $str =~ s/\"/\\\"/g;
	    if (!$list) {print ("\"$value\":\"$str\",\n");};
	} else {
	    print ("$str\n");
	};
    }
}
sub uniq {
    my %seen;
    return grep { !$seen{$_}++ } @_;
}
if (! $svg && ($verbose || $list)) {
    if ($list) {
	my $cmd="$0";
	if (@colorsB) {
	    foreach my $col (uniq(@colorsB)) {
		$cmd = $cmd . " -bg \"$col\"";
	    }
	};
	for my $file (@files) {
	    $cmd = $cmd . " $file";
	}
	print "$cmd\n";
    } else {
	if (@colorsB) {
	    print "Colors before:";
	    foreach my $col (uniq(@colorsB)) {
		print " \"" . $col. "\"";
	    }
	    print "\n";
	}
	if (@colorsA) {
	    print "Colors after: ";
	    foreach my $col (uniq(@colorsA)) {
		print " \"" . $col. "\"";
	    }
	    print "\n";
	};
    };
};
